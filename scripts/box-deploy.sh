#!/usr/bin/env bash
#
# Pull-based deployer — runs ON the VPS on a systemd timer (see deploy/).
#
# Why pull-based: this box sits behind an edge that intermittently drops
# GitHub-runner IPs on port 22, so an Actions->box SSH push is unreliable.
# CI only builds and pushes the image to GHCR; the box pulls it itself.
# Outbound from the box always works, so this is immune to the inbound block.
# Same arrangement as neema-ai on the same machine.
#
# Requires the nuruplace-web GHCR package to be PUBLIC so the box can pull
# anonymously — no registry credentials are stored on this shared box.
#
# Idempotent: git fetch/reset, compose pull and up -d are all no-ops when
# nothing changed, so a two-minute tick causes no churn.
set -euo pipefail

# The checkout lives under /srv and is owned by its own `nuruplace` user, not
# inside another project's home directory. This box hosts several unrelated
# services; a project buried in a colleague's home reads as belonging to them,
# and its files inherit that account's fate.
REPO=${NURUPLACE_REPO:-/srv/nuruplace}
LOCK=/tmp/nuruplace-deploy.lock
OWNER=${NURUPLACE_OWNER:-nuruplace}
IMAGE=ghcr.io/mosesmwicigi24-pixel/nuruplace-web:latest

# Read box-specific settings from the repo's .env rather than baking them in
# here: which port, which compose files, where to knock for health. All three
# are properties of this machine, not of the code.
envval() { sed -n "s/^$1=//p" "$REPO/.env" 2>/dev/null | tail -1; }

WEB_PORT=$(envval WEB_PORT)

# COMPOSE_FILES lets the box switch to docker-compose.direct.yml — the
# no-host-port fallback — without this script needing to know why. Space
# separated; unset means the normal published-port arrangement.
COMPOSE=(docker compose)
COMPOSE_FILES=$(envval COMPOSE_FILES)
if [ -n "$COMPOSE_FILES" ]; then
  # shellcheck disable=SC2206  # deliberate word splitting: it is a file list
  files=($COMPOSE_FILES)
else
  files=(docker-compose.yml docker-compose.vps.yml)
fi
for f in "${files[@]}"; do COMPOSE+=(-f "$f"); done

# On the direct path there is no host port to curl, so the gate has to aim at
# the container's own address. Setting HEALTH_URL in .env covers both.
HEALTH_URL=${NURUPLACE_HEALTH_URL:-$(envval HEALTH_URL)}
HEALTH_URL=${HEALTH_URL:-http://127.0.0.1:${WEB_PORT:-3001}/healthz}

# Never run two deploys at once — a slow pull must not overlap the next tick.
exec 9>"$LOCK"
flock -n 9 || { echo "another deploy is running; skipping"; exit 0; }

cd "$REPO"

# 1. Sync the working tree to origin/main (compose files, nginx, scripts).
#    Run git as the owning user so file ownership stays consistent.
sudo -u "$OWNER" git fetch --quiet origin main
LOCAL=$(sudo -u "$OWNER" git rev-parse HEAD)
REMOTE=$(sudo -u "$OWNER" git rev-parse origin/main)
sudo -u "$OWNER" git reset --quiet --hard origin/main

# 2. Pull the image CI built, and note whether the digest actually moved.
BEFORE=$(docker image inspect -f '{{.Id}}' "$IMAGE" 2>/dev/null || echo none)
"${COMPOSE[@]}" pull --quiet web
AFTER=$(docker image inspect -f '{{.Id}}' "$IMAGE" 2>/dev/null || echo none)

# 3. Recreate only when the git ref or the image digest changed.
if [ "$LOCAL" = "$REMOTE" ] && [ "$BEFORE" = "$AFTER" ]; then
  echo "$(date -Is) up to date (${REMOTE:0:8})"
  exit 0
fi

echo "$(date -Is) deploying ${REMOTE:0:8} (image $BEFORE -> $AFTER)"

# A container that fails to start is left in `Created` state, and a created
# container still holds its host-port reservation in Docker's allocator — with
# no socket, no docker-proxy and nothing for `ss` or `lsof` to see. The next
# attempt is then refused with "address already in use" for a port that
# genuinely is free, and stays refused no matter which port you pick, because
# every attempt leaves another one behind.
#
# So: clear the corpse and retry, once. Only on that specific error — anything
# else fails loudly rather than being retried blind.
ERR=$(mktemp)
trap 'rm -f "$ERR"' EXIT
if ! "${COMPOSE[@]}" up -d --no-deps web 2>"$ERR"; then
  cat "$ERR" >&2
  if grep -qi 'address already in use' "$ERR"; then
    echo "$(date -Is) port bind refused; removing the stale container and retrying once" >&2
    docker rm -f nuruplace_web >/dev/null 2>&1 || true
    "${COMPOSE[@]}" up -d --no-deps web
  else
    exit 1
  fi
fi

# 4. Health gate. /healthz answers 200 directly — it is deliberately excluded
#    from the locale proxy, so a redirect can never fake a pass.
for _ in $(seq 1 10); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$HEALTH_URL" || true)
  [ "$code" = "200" ] && { echo "$(date -Is) deploy OK, web healthy"; exit 0; }
  sleep 5
done

echo "$(date -Is) WARNING: web did not report healthy after deploy" >&2
echo "  last 40 lines of container log:" >&2
"${COMPOSE[@]}" logs --tail 40 web >&2 || true
exit 1
