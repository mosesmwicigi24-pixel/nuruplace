#!/usr/bin/env bash
#
# Does nginx agree with .env about which port the app is on?
#
# Nothing enforces this. WEB_PORT drives the container binding and the deploy
# health gate; nginx has its own hard-coded upstream and never reads .env. When
# they drift, the container is healthy, the deploy reports success, and every
# visitor gets 502 — the failure shows up only in the one place nobody is
# watching.
#
# Checks both copies, because they drift differently:
#   - the repo's file, which is what push/pull distributes
#   - the installed block under /etc/nginx, which is what nginx actually serves
#
# Read-only.
#
#   ./scripts/check-nginx.sh
#   NGINX_CONF=/tmp/x.conf NURUPLACE_REPO=/tmp/repo ./scripts/check-nginx.sh
set -uo pipefail

REPO=${NURUPLACE_REPO:-/srv/nuruplace}
CONF=${NGINX_CONF:-/etc/nginx/sites-available/nuruplace.org}
REPO_CONF="$REPO/deploy/nginx/nuruplace.org.conf"

status=0

want=$(sed -n 's/^WEB_PORT=//p' "$REPO/.env" 2>/dev/null | tail -1)
want=${want:-3001}
printf '%-22s = %s\n' '.env WEB_PORT' "$want"

# The upstream line: `server 127.0.0.1:3013;` inside `upstream nuruplace_web`.
port_of() {
  sed -n 's/^[[:space:]]*server[[:space:]]\{1,\}127\.0\.0\.1:\([0-9]\{1,\}\);.*/\1/p' \
    "$1" 2>/dev/null | head -1
}

for pair in "repo:$REPO_CONF" "installed:$CONF"; do
  label=${pair%%:*}
  file=${pair#*:}
  if [ ! -r "$file" ]; then
    printf '%-22s = (not present at %s)\n' "$label upstream" "$file"
    [ "$label" = installed ] && {
      printf '  install it:  sudo cp %s %s\n' "$REPO_CONF" "$CONF"
      printf '               sudo ln -sf %s /etc/nginx/sites-enabled/\n' "$CONF"
      printf '               sudo nginx -t && sudo systemctl reload nginx\n'
      status=1
    }
    continue
  fi
  got=$(port_of "$file")
  printf '%-22s = %s\n' "$label upstream" "${got:-<none found>}"
  if [ -z "$got" ]; then
    printf '  could not find an `upstream ... server 127.0.0.1:PORT;` line\n' >&2
    status=1
  elif [ "$got" != "$want" ]; then
    printf '  MISMATCH: nginx would proxy to %s, the app is on %s -> every request 502\n' \
      "$got" "$want" >&2
    status=1
  fi
done

[ $status -eq 0 ] && echo "ok   nginx and .env agree on $want"
exit $status
