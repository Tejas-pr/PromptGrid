# ---- Base ----
FROM oven/bun:1.2 AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/ion/package.json ./apps/ion/package.json
COPY packages/ion-auth/package.json ./packages/ion-auth/package.json
COPY packages/ion-db/package.json ./packages/ion-db/package.json
COPY packages/ion-config-eslint/package.json ./packages/ion-config-eslint/package.json
COPY packages/ion-config-typescript/package.json ./packages/ion-config-typescript/package.json
RUN bun install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN cd packages/ion-db && bunx prisma generate

# Build the Next.js app
RUN bun run --filter ion build

# ---- Runner ----
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/apps/ion/.next/standalone ./
COPY --from=builder /app/apps/ion/.next/static ./apps/ion/.next/static
COPY --from=builder /app/apps/ion/public ./apps/ion/public

# Copy Prisma generated client (needed at runtime)
COPY --from=builder /app/packages/ion-db/generated ./packages/ion-db/generated

USER nextjs

EXPOSE 3000

CMD ["node", "apps/ion/server.js"]
