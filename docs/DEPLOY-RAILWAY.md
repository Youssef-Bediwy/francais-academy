# Deploiement sur Railway

Duree estimee : 15 minutes. Deux services : `Postgres` et `web`.

---

## 1. Preparer le depot

```bash
git init
git add .
git commit -m "Francais Academy : version initiale"
git branch -M main
git remote add origin git@github.com:<votre-compte>/francais-academy.git
git push -u origin main
```

Assurez-vous que la premiere migration existe **avant** de pousser :

```bash
docker compose -f docker/docker-compose.dev.yml up -d
npx prisma migrate dev --name init
git add prisma/migrations && git commit -m "Migration initiale" && git push
```

Sans dossier `prisma/migrations`, `prisma migrate deploy` n a rien a appliquer et le
demarrage echouera sur des tables manquantes.

---

## 2. Creer le projet et la base

1. Sur [railway.app](https://railway.app) : **New Project** puis **Deploy from GitHub repo**.
2. Selectionnez le depot. Railway detecte le `Dockerfile` et lance un premier build.
3. Dans le meme projet : **New** puis **Database** puis **Add PostgreSQL**.

Railway expose alors la variable `DATABASE_URL` du service Postgres.

---

## 3. Variables d environnement du service web

Onglet **Variables** du service web :

| Variable | Valeur |
| --- | --- |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (reference, ne recopiez pas la valeur) |
| `AUTH_SECRET` | resultat de `openssl rand -base64 32` |
| `AUTH_COOKIE_NAME` | `fa_session` |
| `AUTH_SESSION_TTL_DAYS` | `30` |
| `NEXT_PUBLIC_APP_URL` | `https://<votre-domaine>.up.railway.app` |
| `NODE_ENV` | `production` |
| `RUN_SEED` | `false` (mettre `true` une seule fois pour peupler la demo) |

> `NEXT_PUBLIC_APP_URL` est lu au build : redeployez apres l avoir modifie.

---

## 4. Reseau et sante

1. **Settings** puis **Networking** puis **Generate Domain**.
2. Le port est fourni par Railway via `PORT` : l image l utilise deja, ne le forcez pas.
3. Healthcheck : `/api/stats` (deja declare dans `railway.json`).

---

## 5. Migrations et donnees

L entrypoint execute `prisma migrate deploy` a chaque demarrage : aucune action manuelle.

Pour peupler la base de demonstration une premiere fois :

```bash
npm i -g @railway/cli
railway login
railway link
railway run npm run db:seed
```

Comptes crees par le seed :

- administrateur : `admin@francais-academy.com` / `Admin1234!`
- apprenant : `demo@francais-academy.com` / `Demo1234!`

Changez ces mots de passe immediatement en production.

---

## 6. Verifications post-deploiement

```bash
curl -s https://<domaine>/api/stats | jq
curl -s -o /dev/null -w "%{http_code}\n" https://<domaine>/fr
curl -s -o /dev/null -w "%{http_code}\n" https://<domaine>/ar
```

Attendu : `200` pour les trois appels, et un JSON de compteurs pour `/api/stats`.
Testez aussi `/ar` visuellement : la page doit basculer en `dir="rtl"`.

---

## 7. Exploitation

- **Logs** : onglet Deployments puis View Logs.
- **Rollback** : Deployments puis un deploiement precedent puis Redeploy.
- **Sauvegardes** : service Postgres puis Backups (activez la sauvegarde quotidienne).
- **Scaling** : `numReplicas` dans `railway.json`. Aucun etat n est stocke en memoire,
  la session vit dans un cookie JWT signe : l application se replique sans adherence serveur.

---

## 8. Problemes frequents

| Symptome | Cause | Correction |
| --- | --- | --- |
| `Environment variable not found: DATABASE_URL` | variable non referencee | utilisez `${{Postgres.DATABASE_URL}}` |
| `AUTH_SECRET doit faire au moins 32 caracteres` | secret trop court | regenerez avec `openssl rand -base64 32` |
| `relation "User" does not exist` | migrations absentes du depot | committez `prisma/migrations` puis redeployez |
| Build bloque sur `prisma generate` | cache corrompu | Deployments puis Redeploy sans cache |
| Page blanche en arabe | police non chargee | verifiez l acces reseau a Google Fonts au build |
