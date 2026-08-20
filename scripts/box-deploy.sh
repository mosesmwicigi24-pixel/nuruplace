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

REPO=${NURUPLACE_REPO:-/home/neema/nuruplace}
LOCK=/tmp/nuruplace-deploy.lock
OWNER=${NURUPLACE_OWNER:-neema}
HEALTH_URL=${NURUPLACE_HEALTH_URL:-http://127.0.0.1:3001/healthz}
COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.vps.yml)
IMAGE=ghcr.io/mosesmwicigi24-pixel/nuruplace-web:latest

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
"${COMPOSE[@]}" up -d --no-deps web

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
