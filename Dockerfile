# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi


FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/build"

RUN npx prisma generate
RUN npm run build


FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder \
  --chown=nextjs:nodejs \
  /app/.next/standalone ./

COPY --from=builder \
  --chown=nextjs:nodejs \
  /app/.next/static ./.next/static

# Important : conserve toute l'installation npm,
# notamment node_modules/.bin/prisma et ses dépendances.
COPY --from=deps \
  --chown=nextjs:nodejs \
  /app/node_modules ./node_modules

COPY --from=builder \
  --chown=nextjs:nodejs \
  /app/prisma ./prisma

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/stats').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["node", "server.js"]