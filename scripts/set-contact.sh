#!/usr/bin/env bash
#
# Set (or clear) the contact-form destination, and refuse anything unusable.
#
#   sudo ./scripts/set-contact.sh https://hooks.example.com/abc123
#   sudo ./scripts/set-contact.sh --clear
#
# Why this exists rather than `echo >> .env`: a placeholder from the setup
# instructions was once pasted verbatim —
#
#   CONTACT_WEBHOOK_URL=https://…your endpoint…
#
# — which is non-empty, so the app accepted it, tried to POST, failed, and
# showed visitors a generic error instead of "please call us". A church form
# that mishandles someone reaching out at a hard moment is the one failure
# this project cannot ship. So the value is validated before it is written,
# the file is left owned by the service account, and the container is
# restarted and checked.
#
# Deliberately no ARGUMENT-FREE mode: this must be an explicit decision.
set -uo pipefail

REPO=${NURUPLACE_REPO:-/srv/nuruplace}
OWNER=${NURUPLACE_OWNER:-nuruplace}
ENVF="$REPO/.env"
COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.vps.yml)

usage() {
  echo "usage: $0 <https://endpoint>   |   $0 --clear" >&2
  exit 2
}

url=${1:-}
[ -z "$url" ] && usage

if [ "$url" != "--clear" ]; then
  # Must be http(s). Anything else cannot receive a POST.
  case "$url" in
    https://*|http://*) ;;
    *) echo "refusing: must start with http:// or https://" >&2; exit 1 ;;
  esac
  # Whitespace or non-ASCII means an unfilled placeholder, not a real URL.
  # This is the check that would have caught `https://…your endpoint…`.
  if printf '%s' "$url" | LC_ALL=C grep -q '[^!-~]'; then
    echo "refusing: contains whitespace or non-ASCII — unfilled placeholder?" >&2
    printf '  got: %s\n' "$url" >&2
    exit 1
  fi
  # A host is required: https:// on its own parses as nothing useful.
  host=${url#*://}; host=${host%%/*}
  [ -z "$host" ] && { echo "refusing: no host in URL" >&2; exit 1; }
fi

[ -f "$ENVF" ] || { install -o "$OWNER" -g "$OWNER" -m 600 /dev/null "$ENVF"; }

# Drop any existing line, then append the new one. Rewriting in place keeps
# every other setting (WEB_PORT, compose overrides) untouched.
tmp=$(mktemp)
grep -v '^CONTACT_WEBHOOK_URL=' "$ENVF" > "$tmp" 2>/dev/null || true
if [ "$url" != "--clear" ]; then
  printf 'CONTACT_WEBHOOK_URL=%s\n' "$url" >> "$tmp"
fi
install -o "$OWNER" -g "$OWNER" -m 600 "$tmp" "$ENVF"
rm -f "$tmp"

if [ "$url" = "--clear" ]; then
  echo "cleared CONTACT_WEBHOOK_URL — the form will tell visitors to call instead"
else
  echo "set CONTACT_WEBHOOK_URL to $url"
fi

cd "$REPO" || exit 1
"${COMPOSE[@]}" up -d web || exit 1

# The container reads env at start, so prove the new value is actually in the
# running process rather than only in the file.
sleep 3
inside=$(docker exec nuruplace_web sh -c 'echo "${CONTACT_WEBHOOK_URL:-<unset>}"' 2>/dev/null)
echo "container sees: ${inside:-<could not read>}"

port=$(sed -n 's/^WEB_PORT=//p' "$ENVF" | tail -1)
curl -s -m 10 -o /dev/null -w 'healthz: %{http_code}\n' \
  "http://127.0.0.1:${port:-3001}/healthz"
