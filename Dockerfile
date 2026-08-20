# nuruplace.org — The Good News Mission
#
# Mirrors the neema-ai/apps/web image so the box runs one familiar shape:
# multi-stage, next/standalone, non-root, healthchecked. npm rather than pnpm
# because this repo has no workspace to hoist.

# ── Stage 1: Dependencies ─────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# `npm ci --omit=dev` would drop the typescript/eslint the build needs, so the
# full tree is installed here and simply never copied into the runner.
RUN npm ci

# ── Stage 2: Builder ──────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Telemetry is off by default here rather than in CI, so a local `docker build`
# behaves the same as the pipeline.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: Runner ───────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Standalone mode — the server and its deps are bundled; no node_modules copy.
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appgroup /app/public ./public

USER appuser
EXPOSE 3000

# Docker sets HOSTNAME to the container id, and Next's standalone server.js
# honours it — so without this it binds only to that hostname and the
# in-container healthcheck on 127.0.0.1 is refused. The app would still answer
# through the published port while reporting "unhealthy" forever.
ENV HOSTNAME=0.0.0.0 PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1

CMD ["node", "server.js"]
