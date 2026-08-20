#!/usr/bin/env bash
#
# Assert that every compose arrangement publishes each container port exactly
# ONCE.
#
# Compose merges `ports` lists across -f files instead of replacing them, so an
# override file that re-declares a mapping to narrow its bind address silently
# produces TWO bindings for the same port. Docker publishes the first, collides
# with itself on the second, and rolls the container start back with:
#
#   failed to bind host port 127.0.0.1:3013/tcp: address already in use
#
# That is indistinguishable from a genuinely occupied port — it fails on every
# port including untried ones, and leaves nothing behind for ss, lsof or
# docker-proxy to find, because the start never completed. It cost days on the
# production box. This check is three seconds and makes it impossible to
# reintroduce unnoticed.
set -uo pipefail
cd "$(dirname "$0")/.."

status=0

check() {
  local label=$1; shift
  local json
  if ! json=$(WEB_PORT=3999 docker compose "$@" config --format json 2>/dev/null); then
    printf 'FAIL %s: compose could not render the config\n' "$label" >&2
    status=1
    return
  fi
  if ! printf '%s' "$json" | node -e '
    let raw = "";
    process.stdin.on("data", (d) => (raw += d));
    process.stdin.on("end", () => {
      const label = process.argv[1];
      const cfg = JSON.parse(raw);
      let bad = false;
      for (const [name, svc] of Object.entries(cfg.services ?? {})) {
        const counts = new Map();
        for (const p of svc.ports ?? []) {
          const key = `${p.target}/${p.protocol ?? "tcp"}`;
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        for (const [key, n] of counts) {
          if (n > 1) {
            console.error(`FAIL ${label}: service ${name} publishes ${key} ${n} times`);
            console.error(JSON.stringify(svc.ports, null, 2));
            bad = true;
          }
        }
      }
      process.exit(bad ? 1 : 0);
    });
  ' "$label"; then
    status=1
    return
  fi
  printf 'ok   %s\n' "$label"
}

check "base only"      -f docker-compose.yml
check "base + vps"     -f docker-compose.yml -f docker-compose.vps.yml
check "direct"         -f docker-compose.direct.yml

# The VPS arrangement must also bind loopback only. This box is shared; a
# container that quietly publishes on 0.0.0.0 is exposed to the internet.
bind=$(WEB_PORT=3999 docker compose -f docker-compose.yml -f docker-compose.vps.yml \
       config --format json 2>/dev/null \
       | node -pe 'JSON.parse(require("fs").readFileSync(0,"utf8")).services.web.ports[0].host_ip ?? ""')
if [ "$bind" = "127.0.0.1" ]; then
  printf 'ok   base + vps binds loopback only (%s)\n' "$bind"
else
  printf 'FAIL base + vps binds %s — expected 127.0.0.1\n' "${bind:-0.0.0.0 (no host_ip)}" >&2
  status=1
fi

exit $status
