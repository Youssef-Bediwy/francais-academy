#!/bin/sh

set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Erreur : DATABASE_URL est absente." >&2
  exit 1
fi

PRISMA_BIN="/app/node_modules/.bin/prisma"

if [ ! -x "$PRISMA_BIN" ]; then
  echo "Erreur : Prisma CLI est absente de l'image Docker." >&2
  exit 1
fi

echo "Application des migrations Prisma..."

"$PRISMA_BIN" migrate deploy

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Insertion des données de démonstration..."
  "$PRISMA_BIN" db seed
fi

echo "Démarrage de Next.js sur le port ${PORT:-3000}..."

exec "$@"