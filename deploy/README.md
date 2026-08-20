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

## It stands on its own

Nothing here is shared with the other projects on the box:

| | |
|---|---|
| Checkout | `/srv/nuruplace`, owned by the `nuruplace` user |
| Image | `ghcr.io/mosesmwicigi24-pixel/nuruplace-web` |
| Container | `nuruplace_web` |
| Compose project / network | `nuruplace` / `nuruplace_default` |
| systemd units | `nuruplace-deploy.service` / `.timer` |
| Port | its own, `127.0.0.1` only |

`/srv` rather than someone's home directory: this box runs a mail server,
neema-ai and bethanyhouse, and a project buried in a colleague's home reads as
belonging to them — and inherits that account's fate if it is ever locked,
moved or removed. The compose project name is pinned rather than derived from
the directory, so the container keeps its identity wherever the checkout sits.

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

`WEB_PORT` drives the compose binding **and** the health gate in
`scripts/box-deploy.sh`. It does **not** drive nginx — update the `upstream`
block in `deploy/nginx/nuruplace.org.conf` to match, then reload nginx.

## When the port is "already in use" and nothing is using it

This box has produced `failed to bind host port 127.0.0.1:NNNN/tcp: address
already in use` on 3001, 3005 and 3013 — including a port that had never been
tried before — while `ss -ltnp` showed nothing listening, `lsof` found nothing
and `docker ps -a` was empty.

Run the diagnostic rather than trying another number:

```bash
cd /srv/nuruplace
sudo ./scripts/port-doctor.sh          # or: sudo ./scripts/port-doctor.sh 3013
```

It distinguishes the four causes, because they have different fixes and look
identical from the error message:

| | Tell | Fix |
|---|---|---|
| Bound, but not LISTENing | `ss -tnpa` shows it, `ss -ltnp` does not | find the owner |
| Inside the **ephemeral range** | `ip_local_port_range` covers the port | reserve it (below) |
| Deploy timer racing you | `nuruplace-deploy.timer` is active | `systemctl stop` it first |
| Leaked endpoint | stale container or `docker-proxy` | remove it |

### It was the leaked `Created` container

On this box it turned out to be the fourth: `port-doctor.sh` found
`nuruplace_web  Created` still sitting there, while step 5 proved the daemon
could publish a random high port perfectly well.

**A container in `Created` state still holds its host-port reservation** in
Docker's allocator. It has no socket, no `docker-proxy`, and no entry in `ss`
or `lsof` — but the daemon will refuse to hand that port to anything else. And
a container that fails to start is *left* in `Created` state, so every failed
attempt leaves another one behind. That is the trap: the second attempt fails
because of the first, the third because of the second, and picking a fresh port
number never helps because the port was never the problem.

Clear it and start again:

```bash
docker rm -f nuruplace_web
docker network rm nuruplace_default 2>/dev/null
docker compose -f docker-compose.yml -f docker-compose.vps.yml up -d web
```

`scripts/box-deploy.sh` now does this by itself — if `up -d` fails with
`address already in use` it removes the stale container and retries once. Only
on that error; anything else still fails loudly.

### If it really is the ephemeral range

Worth knowing because it is invisible after the fact and looks identical. If
`net.ipv4.ip_local_port_range` has been widened downward, the kernel can hand
out the port as the **source** port of an outbound connection — and a mail
server makes a great many outbound connections. `bind()` fails with EADDRINUSE,
the connection closes a moment later, and by the time you look the port is
free. Every port in the range is a coin flip. Reserve it:

```bash
sudo sysctl -w net.ipv4.ip_local_reserved_ports=3013
echo 'net.ipv4.ip_local_reserved_ports = 3013' \
  | sudo tee /etc/sysctl.d/60-nuruplace-port.conf
```

Immediate, survives reboot, touches neither the mail server nor Docker.

**Do not restart the Docker daemon to clear any of this.** The church's mail
server runs in Docker on this box — ports 25, 110, 143, 465, 587, 993, 995 and
4190. A restart to fix a website takes the church's email down with it.

### Last resort: no host port at all

If the allocator will not hand out any port (`port-doctor.sh` step 5 fails
too), stop fighting it. `docker-compose.direct.yml` gives the container a
fixed address on its own bridge and publishes nothing:

```bash
docker compose -f docker-compose.direct.yml up -d web
curl -s -o /dev/null -w '%{http_code}\n' http://172.29.0.2:3000/healthz
```

Then point nginx at `172.29.0.2:3000` instead of `127.0.0.1:NNNN`, and tell
the deploy timer to use the same file:

```bash
sudo -u nuruplace tee -a /srv/nuruplace/.env >/dev/null <<'ENV'
COMPOSE_FILES=docker-compose.direct.yml
HEALTH_URL=http://172.29.0.2:3000/healthz
ENV
```

Check the subnet is free first — `docker network inspect $(docker network ls -q)
| grep Subnet` — and change `WEB_SUBNET`/`WEB_IP` in `.env` if 172.29.0.0/24 is
taken. This is not worse than a published port for our purposes; it is only
less conventional, and nginx reaches a bridge address exactly as easily.

## Always run git as `nuruplace`, never as root

The checkout is owned by `nuruplace`. Git refuses to operate on a repository
owned by someone else and says so:

```
fatal: detected dubious ownership in repository at '/srv/nuruplace'
```

That is a **failure**, not a warning. If you typed several commands at once,
the ones after it still ran — against the old code — which produces errors that
look like the thing you were trying to fix and are not.

```bash
sudo -u nuruplace git pull      # right
git pull                        # wrong, as root
```

`scripts/box-deploy.sh` already does this correctly (`sudo -u "$OWNER" git …`),
so automatic deploys are unaffected. It only bites manual commands.

Adding `safe.directory` for root would silence it, but then root-run git leaves
root-owned objects in a `nuruplace`-owned tree and the timer breaks later. Run
git as the owner instead. The same applies to `.env`:

```bash
echo 'WEB_PORT=3013' >> .env                     # creates a root-owned file
sudo chown nuruplace:nuruplace .env              # or the timer cannot read it
```

## Moving an existing checkout out of `/home/neema` (done, kept for reference)

Early instructions put the checkout at `/home/neema/nuruplace`. Nothing depends
on that path except the systemd unit, so relocating is cheap — and the image,
container and network were always separate, so nothing about the running site
is entangled with neema-ai.

```bash
# Stop the loop before moving anything under it
sudo systemctl stop nuruplace-deploy.timer
cd /home/neema/nuruplace
docker compose -f docker-compose.yml -f docker-compose.vps.yml down --remove-orphans

# Account and new home
sudo useradd --system --shell /usr/sbin/nologin nuruplace 2>/dev/null || true
sudo mv /home/neema/nuruplace /srv/nuruplace
sudo chown -R nuruplace:nuruplace /srv/nuruplace

# Point the unit at the new path and reload
cd /srv/nuruplace
sudo -u nuruplace git pull
sudo cp deploy/nuruplace-deploy.* /etc/systemd/system/
sudo systemctl daemon-reload

# Bring it back up from the new location
docker compose -f docker-compose.yml -f docker-compose.vps.yml up -d web
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:"${WEB_PORT:-3001}"/healthz
sudo systemctl start nuruplace-deploy.timer
```

`.env` moves with the directory, so the contact destination and port survive.

## One-time setup on the box

```bash
# 1. Its own service account and its own directory. No login shell: this
#    account exists to own files and run git, not for anyone to sign in as.
sudo useradd --system --create-home --home-dir /srv/nuruplace \
             --shell /usr/sbin/nologin nuruplace
sudo usermod -aG docker nuruplace          # only if you want non-root compose

sudo -u nuruplace git clone https://github.com/mosesmwicigi24-pixel/nuruplace.git /srv/nuruplace

# 2. Contact-form destination (the form refuses to submit without one)
sudo -u nuruplace tee /srv/nuruplace/.env >/dev/null <<'ENV'
CONTACT_WEBHOOK_URL=https://…            # or the CONTACT_EMAIL_* trio
WEB_PORT=3013                            # a port nothing else on this box uses
ENV

# 3. First pull and start
cd /srv/nuruplace
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
cd /srv/nuruplace
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
