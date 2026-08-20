# Deploying nuruplace.org

The site runs on the church VPS (`72.60.187.67`) alongside neema-ai and
bethanyhouse, using the same pull-based arrangement:

```
push to main
   ↓
GitHub Actions: ci.yml (lint, typecheck, build, 153 responsive/a11y tests)
   ↓  green only
GitHub Actions: deploy.yml builds the image → ghcr.io/…/nuruplace-web:latest
   ↓
VPS systemd timer (every 2 min) runs scripts/box-deploy.sh
   ↓  pulls, recreates only if the digest moved, then health-gates
host nginx (TLS) → 127.0.0.1:3001
```

**CI does not deploy.** The box pulls. That is not a preference — the host edge
intermittently drops GitHub-runner IPs on port 22, which made Actions→box SSH
pushes unreliable. Outbound-from-box pulls are unaffected. neema-ai hit this
first; this repo inherits the fix rather than rediscovering it.

Because the box pulls whatever is tagged `latest`, **the image push is the
deploy** — so `deploy.yml` will not build until `ci.yml` is green.

## Port

Default `3001` — port 3000 belongs to neema-ai's web container. Published on
`127.0.0.1` only: the box is shared, and nothing here should face the internet
except through nginx.

**This box already has services on ports you may not expect.** If `up -d`
fails with `failed to bind host port ... address already in use`, find the
holder and pick another port:

```bash
sudo ss -ltnp | grep -E ':(3001|3002|3003)\b'     # what is listening
echo 'WEB_PORT=3002' >> /home/neema/nuruplace/.env  # pick a free one
docker compose -f docker-compose.yml -f docker-compose.vps.yml up -d web
```

`WEB_PORT` drives the compose binding **and** the health gate in
`scripts/box-deploy.sh`. It does **not** drive nginx — update the `upstream`
block in `deploy/nginx/nuruplace.org.conf` to match, then reload nginx.

## Always run git as `neema`, never as root

The checkout is owned by `neema`. Git refuses to operate on a repository owned
by someone else and says so:

```
fatal: detected dubious ownership in repository at '/home/neema/nuruplace'
```

That is a **failure**, not a warning. If you typed several commands at once,
the ones after it still ran — against the old code — which produces errors that
look like the thing you were trying to fix and are not.

```bash
sudo -u neema git pull          # right
git pull                        # wrong, as root
```

`scripts/box-deploy.sh` already does this correctly (`sudo -u "$OWNER" git …`),
so automatic deploys are unaffected. It only bites manual commands.

Adding `safe.directory` for root would silence it, but then root-run git leaves
root-owned objects in a `neema`-owned tree and the timer breaks later. Run git
as the owner instead. The same applies to `.env`:

```bash
echo 'WEB_PORT=3005' >> .env               # creates a root-owned file
sudo chown neema:neema .env                # fix it, or the timer cannot read it
```

## One-time setup on the box

```bash
# 1. Clone beside the other projects
sudo -u neema git clone https://github.com/mosesmwicigi24-pixel/nuruplace.git /home/neema/nuruplace

# 2. Contact-form destination (the form refuses to submit without one)
sudo -u neema tee /home/neema/nuruplace/.env >/dev/null <<'ENV'
CONTACT_WEBHOOK_URL=https://…            # or the CONTACT_EMAIL_* trio
ENV

# 3. First pull and start
cd /home/neema/nuruplace
docker compose -f docker-compose.yml -f docker-compose.vps.yml pull web

# Prove the port actually resolved before starting anything — this is the step
# that catches a stale checkout or a misspelled .env, and it costs one second.
docker compose -f docker-compose.yml -f docker-compose.vps.yml config | grep -A3 'ports:'

docker compose -f docker-compose.yml -f docker-compose.vps.yml up -d web
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:"${WEB_PORT:-3001}"/healthz   # expect 200

# 4. Automatic deploys
sudo cp deploy/nuruplace-deploy.* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now nuruplace-deploy.timer
systemctl list-timers nuruplace-deploy.timer

# 5. nginx (see the header of deploy/nginx/nuruplace.org.conf)
sudo certbot --nginx -d nuruplace.org -d www.nuruplace.org
sudo cp deploy/nginx/nuruplace.org.conf /etc/nginx/sites-available/nuruplace.org
sudo ln -sf /etc/nginx/sites-available/nuruplace.org /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

**Make the GHCR package public** (Packages → nuruplace-web → Package settings →
Change visibility). The box pulls anonymously; no registry credentials are
stored on a shared machine.

## Cutover, and how to undo it

The CodeIgniter site is served by a different server block on this same box.
Cutover is enabling this block instead of that one and reloading nginx.
Rollback is the same two commands in reverse — **keep the old block on disk**
until you are satisfied. Nothing about the old site is deleted by any of this.

## Rolling back a bad release

Every build is also tagged with its commit sha:

```bash
cd /home/neema/nuruplace
IMAGE_TAG=<sha> docker compose -f docker-compose.yml -f docker-compose.vps.yml up -d web
```

Then push a revert so the timer does not pull `latest` straight back over it.

## Checking on it

```bash
systemctl status nuruplace-deploy.service      # last run
journalctl -u nuruplace-deploy.service -n 50   # what it did
docker compose -f docker-compose.yml -f docker-compose.vps.yml logs -f web
```

## Optional: Cloudflare in front

The site is 36 prerendered static routes, so it caches almost perfectly at an
edge. Putting Cloudflare's free tier in front of this box gives global caching,
TLS and DDoS protection without changing anything above — useful given the
church's stated reach beyond Nairobi, and a single Nairobi box is otherwise
both a single point of failure and slow for distant readers.
