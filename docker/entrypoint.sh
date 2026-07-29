#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL est absent : impossible de demarrer." >&2
  exit 1
fi

echo "Application des migrations Prisma..."
./node_modules/.bin/prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
  echo "Insertion des donnees de demonstration..."
  ./node_modules/.bin/prisma db seed || echo "Seed ignore (deja execute ou tsx absent en production)."
fi

echo "Demarrage de Next.js sur le port ${PORT:-3000}"
exec "$@"
