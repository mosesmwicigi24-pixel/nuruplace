#!/usr/bin/env bash
#
# Why will the container not bind its host port?
#
#   failed to bind host port 127.0.0.1:3013/tcp: address already in use
#
# ...while `ss -ltnp` shows nothing listening there. That is not a
# contradiction. There are four ways to produce it and they need four
# different fixes, so guessing costs more than checking:
#
#   1. Something IS bound, but not in LISTEN state — `ss -l` only shows
#      listeners, so a socket in TIME_WAIT or a bound-but-unconnected socket
#      is invisible to the usual check.
#   2. The port sits inside the kernel's EPHEMERAL range. Every outbound
#      connection this box makes — and it runs a mail server, so that is a
#      lot — can be handed the port as a source port. bind() then fails, and
#      by the time you look the connection has closed and the port is free
#      again. This one is intermittent, port-agnostic and leaves no trace,
#      which is exactly the shape of the failures seen here.
#   3. Two `docker compose up` runs are racing. The deploy timer fires every
#      two minutes; its flock stops it overlapping itself, but not you.
#   4. A stale container or leaked libnetwork endpoint still holds the
#      reservation even though `docker ps` looks clean.
#
# Read-only. Nothing here changes the box; every fix is printed, not applied.
#
#   sudo ./scripts/port-doctor.sh          # uses WEB_PORT from .env
#   sudo ./scripts/port-doctor.sh 3013
set -uo pipefail

REPO=${NURUPLACE_REPO:-/srv/nuruplace}
PORT=${1:-$(sed -n 's/^WEB_PORT=//p' "$REPO/.env" 2>/dev/null | tail -1)}
PORT=${PORT:-3001}

hr() { printf '\n\033[1m== %s\033[0m\n' "$1"; }
say() { printf '   %s\n' "$*"; }
verdict() { printf '\n\033[1;33m>> %s\033[0m\n' "$*"; }

printf '\033[1mport-doctor: %s\033[0m\n' "$PORT"
[ "$(id -u)" -eq 0 ] || say "(not root — socket owners will be hidden; re-run with sudo)"

# ---------------------------------------------------------------- 1. bound?
# -a, not -l. The whole point is to see states other than LISTEN. Match the
# port exactly rather than grepping, so 3013 cannot hide from a pattern
# written for 300[0-9].
hr "1. Any socket on :$PORT, in any state"
sockets=$(ss -tnpa "sport = :$PORT or dport = :$PORT" 2>/dev/null | tail -n +2)
if [ -n "$sockets" ]; then
  printf '%s\n' "$sockets"
  verdict "Something holds :$PORT. Identify the owner above before reusing it."
else
  say "ss: nothing, in any state"
fi

# ss has a blind spot and it is exactly the one that matters here: a TCP
# socket that has been bind()ed but never listen()ed sits in CLOSE and is not
# reported by `ss -tan` at all. It still owns the port. lsof and fuser walk
# open file descriptors instead of the TCP tables, so they see it.
if command -v lsof >/dev/null 2>&1; then
  held=$(lsof -nP -iTCP:"$PORT" 2>/dev/null | tail -n +2)
  [ -n "$held" ] && { printf '%s\n' "$held"; verdict "lsof found an owner ss could not see."; } \
                 || say "lsof: no owner"
else
  say "lsof: not installed (apt-get install lsof) — this is the check ss cannot do"
fi
if command -v fuser >/dev/null 2>&1; then
  f=$(fuser -n tcp "$PORT" 2>&1 | tr -d '\n')
  [ -n "${f// /}" ] && say "fuser: $f" || say "fuser: no owner"
fi

# ------------------------------------------------------- 2. ephemeral range
# The most likely explanation for a FRESH port failing, and the only one that
# is invisible after the fact.
hr "2. Kernel ephemeral port range"
range=$(sysctl -n net.ipv4.ip_local_port_range 2>/dev/null)
reserved=$(sysctl -n net.ipv4.ip_local_reserved_ports 2>/dev/null)
low=$(echo "$range" | awk '{print $1}')
high=$(echo "$range" | awk '{print $2}')
say "net.ipv4.ip_local_port_range     = $range   (default: 32768 60999)"
say "net.ipv4.ip_local_reserved_ports = ${reserved:-<empty>}"
if [ -n "$low" ] && [ "$PORT" -ge "$low" ] && [ "$PORT" -le "$high" ]; then
  verdict "$PORT IS INSIDE THE EPHEMERAL RANGE. This is almost certainly it."
  cat <<EOF

   Any outbound connection can be handed $PORT as its source port, and then
   bind() fails with EADDRINUSE. It clears by itself, which is why the port
   looks free a second later and why a brand-new port fails the same way.

   Fix — reserve the port so the kernel stops handing it out. This does not
   touch the mail server and does not need a daemon restart:

     sudo sysctl -w net.ipv4.ip_local_reserved_ports=$PORT
     echo 'net.ipv4.ip_local_reserved_ports = $PORT' \\
       | sudo tee /etc/sysctl.d/60-nuruplace-port.conf

   If other services on this box already sit in the range, reserve them too —
   comma-separated, ranges allowed: 3000-3013,8080
EOF
else
  say "$PORT is outside the ephemeral range — not cause 2"
fi

# ------------------------------------------------------------- 3. the timer
hr "3. Is the deploy loop racing you?"
t=$(systemctl is-active nuruplace-deploy.timer 2>/dev/null || echo unknown)
s=$(systemctl is-active nuruplace-deploy.service 2>/dev/null || echo unknown)
say "nuruplace-deploy.timer   = $t"
say "nuruplace-deploy.service = $s"
if [ "$t" = "active" ] || [ "$s" = "activating" ] || [ "$s" = "active" ]; then
  verdict "The loop is live. Stop it before running compose by hand:"
  say "  sudo systemctl stop nuruplace-deploy.timer"
  say "  (the flock stops it overlapping itself — it does not stop it racing you)"
else
  say "not running — not cause 3"
fi

# --------------------------------------------------- 4. stale docker state
hr "4. Stale containers and endpoints"
if ! docker version --format '{{.Server.Version}}' >/dev/null 2>&1; then
  DOCKER_UP=no
  verdict "Cannot reach the Docker daemon — steps 4 and 5 cannot run."
  say "$(docker version 2>&1 | tail -1)"
else
  DOCKER_UP=yes
  docker ps -a --filter name=nuruplace --format '   {{.Names}}  {{.Status}}  {{.Ports}}' \
    2>/dev/null | grep . || say "no nuruplace containers (any state)"
  docker network ls --filter name=nuruplace --format '   {{.Name}}  {{.Driver}}' \
    2>/dev/null | grep . || say "no nuruplace networks"
  proxies=$(ps -eo pid,args | grep '[d]ocker-proxy' | grep -w "$PORT")
  if [ -n "$proxies" ]; then
    printf '%s\n' "$proxies"
    verdict "A docker-proxy still holds $PORT — see cause 4."
  else
    say "no docker-proxy on $PORT"
  fi
fi

# ------------------------------------------------------ 5. control: can it?
# The decisive test. If a throwaway container cannot take a random high port
# either, the problem is the allocator and not this project or this port.
#
# Print the daemon's own error rather than inferring from an exit code. "could
# not bind" and "could not reach the daemon" are different diagnoses, and
# collapsing them into one verdict is how you end up fixing the wrong thing.
hr "5. Control test — can the daemon publish ANY port right now?"
if [ "$DOCKER_UP" = no ]; then
  say "skipped — no daemon (see step 4)"
else
  probe=$((PORT + 20000))
  img=$(docker images --format '{{.Repository}}:{{.Tag}}' 2>/dev/null \
        | grep -m1 'nuruplace-web')
  img=${img:-busybox:latest}
  say "trying 127.0.0.1:$probe with $img"
  err=$(docker run --rm -d --name nuruplace_porttest --entrypoint sleep \
          -p "127.0.0.1:$probe:3000" "$img" 30 2>&1 >/dev/null)
  rc=$?
  docker rm -f nuruplace_porttest >/dev/null 2>&1
  if [ $rc -eq 0 ]; then
    verdict "The daemon CAN publish ports. The problem is specific to $PORT."
    say "Combined with step 2, that points at the ephemeral range."
  elif printf '%s' "$err" | grep -qi 'address already in use'; then
    verdict "A throwaway container could not take $probe either."
    say "$err"
    say ""
    say "The allocator is refusing every port, not just $PORT. Do NOT restart"
    say "the docker daemon — this box runs the church mail server. Take the"
    say "no-host-port path instead:"
    say "  docker compose -f docker-compose.direct.yml up -d web"
    say "  (see 'Last resort: no host port at all' in deploy/README.md)"
  else
    verdict "The control test failed for an unrelated reason:"
    say "$err"
    say "That is not a port problem — read the error above before going further."
  fi
fi

# -------------------------------------------------- 6. isolate the variable
# Step 5 proves the daemon can publish SOME port. It does not say which of the
# two things that differ from the real run is to blame: the port number, or the
# user-defined bridge compose puts the container on. Testing them together is
# how you end up with a theory instead of an answer, so test them apart.
hr "6. Is it the port, or the network?"
if [ "$DOCKER_UP" = no ]; then
  say "skipped — no daemon"
else
  img=$(docker images --format '{{.Repository}}:{{.Tag}}' 2>/dev/null \
        | grep -m1 'nuruplace-web')
  img=${img:-busybox:latest}
  free=$((PORT + 20001))
  net=nuruplace_porttest_net

  probe() { # name, port, [network args...]
    local n=$1 p=$2; shift 2
    local e
    e=$(docker run --rm -d --name "$n" --entrypoint sleep "$@" \
          -p "127.0.0.1:$p:3000" "$img" 15 2>&1 >/dev/null)
    local r=$?
    docker rm -f "$n" >/dev/null 2>&1
    [ $r -eq 0 ] && echo OK || echo "FAILED: $(printf '%s' "$e" | tail -1)"
  }

  docker network create "$net" >/dev/null 2>&1
  a=$(probe pd_a "$PORT")                       # target port, default bridge
  b=$(probe pd_b "$free" --network "$net")      # free port, user-defined net
  docker network rm "$net" >/dev/null 2>&1

  say "A  port $PORT on the default bridge   : $a"
  say "B  port $free on a user-defined bridge : $b"
  say ""
  if [ "${a#OK}" != "$a" ] && [ "${b#OK}" != "$b" ]; then
    verdict "Both work in isolation — only the COMBINATION fails."
    say "Look for a leaked reservation tied to this compose project."
  elif [ "${a#OK}" = "$a" ] && [ "${b#OK}" != "$b" ]; then
    verdict "Port $PORT itself is refused; the network is fine."
    say "The daemon's allocator is holding $PORT with nothing behind it. That"
    say "state lives in the daemon and does not clear when containers are"
    say "removed — and the daemon must NOT be restarted on this box."
    say ""
    say "Take a port well away from the ones already churned:"
    say "  sudo -u $OWNER sed -i 's/^WEB_PORT=.*/WEB_PORT=8090/' $REPO/.env"
    say "  docker compose -f docker-compose.yml -f docker-compose.vps.yml up -d web"
    say "  # then set the nginx upstream to 8090 to match"
  elif [ "${a#OK}" != "$a" ]; then
    verdict "The user-defined bridge is the problem, not port $PORT."
    say "Use docker-compose.direct.yml, or clear the project's networks."
  else
    verdict "Neither works. Re-read step 5 — the allocator is refusing broadly."
    say "Use docker-compose.direct.yml (no host port at all)."
  fi
fi

hr "done"
