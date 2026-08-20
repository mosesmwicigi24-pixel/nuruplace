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

`3001`. Port 3000 on this box belongs to neema-ai's web container. The
container is published on `127.0.0.1` only — the box is shared, and nothing
here should face the internet except through nginx.

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
docker compose -f docker-compose.yml -f docker-compose.vps.yml up -d web
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3001/healthz   # expect 200

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
