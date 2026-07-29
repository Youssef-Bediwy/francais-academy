# Français Academy

Plateforme d'apprentissage du français **de A1 à C2**, conçue pour les arabophones.
Interface, contenus et corrections en français **et** en arabe, avec bascule LTR/RTL automatique.

Next.js 14 (App Router) · React · TypeScript strict · TailwindCSS · Prisma · PostgreSQL · Docker · Railway

---

## Sommaire

1. [Présentation](#1-présentation)
2. [Architecture](#2-architecture)
3. [Structure du projet](#3-structure-du-projet)
4. [Installation](#4-installation)
5. [Variables d'environnement](#5-variables-denvironnement)
6. [Prisma et base de données](#6-prisma-et-base-de-données)
7. [Docker](#7-docker)
8. [Déploiement Railway](#8-déploiement-railway)
9. [API REST](#9-api-rest)
10. [Tests](#10-tests)
11. [Accessibilité et performance](#11-accessibilité-et-performance)
12. [Commandes utiles](#12-commandes-utiles)

---

## 1. Présentation

### Fonctionnalités

| Domaine | Détail |
| --- | --- |
| **Accueil** | Hero, statistiques issues de la base, 10 catégories, cours populaires, dernières leçons, avis, CTA |
| **Cours** | 30 cours sur 10 compétences et 6 niveaux CECRL, filtres (recherche, catégorie, niveau), tri, pagination dans l URL |
| **Leçons** | 120 leçons bilingues : texte, explication détaillée, exemples FR/AR, vocabulaire, audio, résumé, navigation précédent/suivant |
| **Exercices** | 9 types : QCM, flashcards, texte à trous, association, remise en ordre, vrai/faux, complétion, écoute, prononciation. Score, correction et explication par question |
| **Révision** | Répétition espacée SM-2, historique des erreurs, recommandations automatiques basées sur les exercices échoués |
| **Progression** | XP, niveau interne, série quotidienne, pourcentage global, temps passé, cours et leçons terminés, exercices réussis, précision |
| **Gamification** | 50 badges sur 7 familles de critères, succès débloqués, objectif quotidien paramétrable, calendrier d activité, classement |
| **Recherche** | Instantanée (debounce 350 ms) sur cours, leçons et vocabulaire, avec filtres et portée |
| **Favoris** | Cours, leçons et cartes mémoire |
| **Tableau de bord** | Statistiques, graphiques Recharts, activité récente, objectifs, recommandations |
| **Administration** | Vue d ensemble chiffrée, gestion des cours, catégories, leçons, cartes et utilisateurs (double garde middleware + serveur) |
| **i18n** | FR/AR, attribut `dir` calculé côté serveur, polices dédiées, utilitaires logiques (`ps-`, `me-`, `text-start`) |

### Contenu généré par le seed

10 catégories · 30 cours · 120 leçons · 500 mots · 300 exercices (environ 1 300 questions) · 200 cartes · 50 badges · 7 comptes de démonstration.

Le corpus lexical est réel (568 paires FR/AR curées, 500 injectées). Les leçons et les exercices sont
produits par des générateurs déterministes à partir de ce corpus : le seed est reproductible et le
contenu reste cohérent entre vocabulaire, exemples, questions et corrections.

---

## 2. Architecture

Clean Architecture pragmatique, dépendances toujours dirigées vers l intérieur :

```
app/ + components/ + features/     UI, routing, Server Components
              v
services/                          règles métier, use cases (aucune I/O HTTP)
              v
repositories/                      seul endroit qui connaît Prisma
              v
Prisma -> PostgreSQL
```

**Règles non négociables**

- `@prisma/client` n est importé que dans `repositories/` (et le seed).
- Un service n importe jamais `next/*` : il reste testable sans framework.
- Un Route Handler ne fait que valider (Zod), appeler un service, mapper la réponse HTTP.
- Les entités Prisma ne sortent jamais telles quelles vers le client : `services/mappers.ts` les
  convertit en DTO. Les bonnes réponses d un exercice ne quittent jamais le serveur.
- Server Components par défaut ; `use client` uniquement pour l interactivité réelle.

**Décisions techniques**

| Choix | Raison |
| --- | --- |
| Radix UI pour Modal, Dropdown, Tabs, Tooltip | focus trap et ARIA corrects sans réécrire l accessibilité ; le style reste 100 % maison (Tailwind + CVA) |
| i18n maison (`lib/i18n`) | dictionnaires JSON, clés pointées, interpolation `{var}`, zéro dépendance et zéro surprise de version |
| Session JWT en cookie httpOnly (`jose`) | vérifiable dans le middleware Edge, aucun état serveur, réplication horizontale immédiate |
| Correction des exercices 100 % serveur | impossible de tricher depuis le client ; `gradeQuestion` est une fonction pure testée unitairement |
| SM-2 isolé dans `computeSm2` | algorithme pur, sans I/O, couvert par six tests |

---

## 3. Structure du projet

```
src/
├── app/
│   ├── [locale]/            pages publiques, (app) espace connecté, admin
│   └── api/                 30 Route Handlers REST
├── components/
│   ├── ui/                  design system (27 composants)
│   ├── layout/              navbar, sidebar, footer, nav mobile, switch de langue
│   ├── domain/              cartes métier (cours, leçon, exercice, XP, série)
│   ├── charts/              wrappers Recharts (client)
│   └── providers/           i18n, session, toasts, tooltips
├── features/                tranches verticales (exercices, révision, recherche, auth, admin)
├── services/                logique métier + mappers DTO
├── repositories/            accès Prisma (+ interfaces de contrat)
├── lib/                     prisma, auth, env, api (erreurs/réponses/handlers), i18n, cache, logger
├── hooks/                   hooks transverses réutilisables
├── types/  utils/  constants/  styles/  messages/
└── middleware.ts            préfixe de langue + garde auth et rôle
prisma/
├── schema.prisma            17 modèles, 11 enums
└── seed/                    données curées + générateurs déterministes
tests/                       unit · components · api · factories
docker/                      entrypoint + compose de développement
docs/DEPLOY-RAILWAY.md       procédure de déploiement détaillée
```

| Dossier | Responsabilité | Interdits |
| --- | --- | --- |
| `app/` | routing, Server Components, métadonnées | logique métier, Prisma direct |
| `components/ui/` | primitives du design system | fetch, texte codé en dur |
| `components/domain/` | cartes présentationnelles typées métier | appels réseau |
| `features/` | assemblage UI + hooks + appels client | requêtes base |
| `services/` | use cases et règles métier | `next/*`, `Request`, `Response` |
| `repositories/` | requêtes Prisma | règles métier |
| `lib/` | infrastructure technique | composants React |

---

## 4. Installation

Prérequis : **Node 20+**, **npm 10+**, PostgreSQL 16 (ou Docker).

```bash
# 1. dépendances
npm install

# 2. configuration
cp .env.example .env
#    puis générez le secret : openssl rand -base64 32

# 3. base de données locale (si vous n avez pas PostgreSQL)
docker compose -f docker/docker-compose.dev.yml up -d

# 4. schéma + données de démonstration
npx prisma migrate dev --name init
npm run db:seed

# 5. démarrage
npm run dev
```

Application sur <http://localhost:3000>, redirigée vers `/fr` ou `/ar` selon `Accept-Language`.

| Rôle | Email | Mot de passe |
| --- | --- | --- |
| Administrateur | `admin@francais-academy.com` | `Admin1234!` |
| Apprenant | `demo@francais-academy.com` | `Demo1234!` |

---

## 5. Variables d environnement

| Variable | Requis | Défaut | Rôle |
| --- | --- | --- | --- |
| `DATABASE_URL` | oui | — | chaîne de connexion PostgreSQL |
| `AUTH_SECRET` | oui | — | signature des JWT de session, **32 caractères minimum** |
| `AUTH_COOKIE_NAME` | non | `fa_session` | nom du cookie de session |
| `AUTH_SESSION_TTL_DAYS` | non | `30` | durée de vie de la session |
| `NEXT_PUBLIC_APP_URL` | non | `http://localhost:3000` | URL publique (metadata, sitemap, robots) |
| `NODE_ENV` | non | `development` | mode d exécution |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | non | voir `.env.example` | compte admin du seed |
| `SEED_DEMO_EMAIL` / `SEED_DEMO_PASSWORD` | non | voir `.env.example` | compte apprenant du seed |
| `RUN_SEED` | non | `false` | si `true`, l entrypoint Docker exécute le seed au démarrage |

La validation est centralisée dans `src/lib/env.ts` (Zod) : une variable manquante ou invalide échoue
immédiatement avec un message explicite, pas au premier appel base.

---

## 6. Prisma et base de données

17 modèles : `User`, `UserStatistics`, `Category`, `Course`, `Lesson`, `Vocabulary`, `Exercise`,
`Question`, `Answer`, `ExerciseResult`, `Flashcard`, `RevisionSession`, `Progress`, `Favorite`,
`Badge`, `Achievement`, `DailyGoal`.

Points de conception à connaître :

- **`Progress`** cible soit un cours (`courseId`) soit une leçon (`lessonId`), jamais les deux. Les
  contraintes `@@unique([userId, courseId])` et `@@unique([userId, lessonId])` reposent sur ce choix,
  PostgreSQL considérant les `NULL` comme distincts.
- **`RevisionSession`** porte l état SM-2 d une carte pour un utilisateur : `@@unique([userId, flashcardId])`.
- **`Answer.matchKey`** est réutilisé selon le type d exercice : clé de rapprochement pour `MATCHING`,
  rang attendu pour `WORD_ORDER`.
- Tous les contenus pédagogiques sont bilingues via les suffixes `Fr` et `Ar`.
- Index posés sur les accès réels : `(categoryId, level)`, `(courseId, position)`, `(userId, dueAt)`,
  `(userId, createdAt)`.

```bash
npx prisma migrate dev --name ma_migration   # créer une migration en développement
npx prisma migrate deploy                    # appliquer en production
npx prisma studio                            # explorateur visuel
npm run db:seed                              # remplir la base
npm run db:reset                             # tout recréer puis reseeder
```

> Le dossier `prisma/migrations` doit être committé : c est lui que `migrate deploy` applique en
> production. Lancez `prisma migrate dev --name init` avant votre premier déploiement.

---

## 7. Docker

```bash
# pile complète (PostgreSQL + application)
docker compose up --build

# première fois : peupler la base au démarrage
RUN_SEED=true docker compose up --build

# Adminer sur http://localhost:8080 (profil optionnel)
docker compose --profile tools up -d adminer
```

Le `Dockerfile` est multi-étapes (`deps`, `builder`, `runner`) et s appuie sur la sortie `standalone`
de Next : l image finale ne contient que le serveur, les assets et le client Prisma, tourne en
utilisateur non root (`nextjs`, uid 1001) et expose un healthcheck sur `/api/stats`.
`docker/entrypoint.sh` applique les migrations avant de démarrer le serveur.

---

## 8. Déploiement Railway

Procédure complète (variables, healthcheck, rollback, pannes courantes) :
**[`docs/DEPLOY-RAILWAY.md`](docs/DEPLOY-RAILWAY.md)**.

Version courte :

1. `New Project` puis `Deploy from GitHub repo` : le `Dockerfile` est détecté automatiquement.
2. `New` puis `Database` puis `Add PostgreSQL`.
3. Variables du service web : `DATABASE_URL = ${{Postgres.DATABASE_URL}}`, `AUTH_SECRET`,
   `NEXT_PUBLIC_APP_URL`, `NODE_ENV=production`.
4. `Settings` puis `Networking` puis `Generate Domain`.
5. `railway run npm run db:seed` une seule fois pour le contenu de démonstration.

Les migrations sont appliquées à chaque démarrage. `railway.json` déclare le builder, le healthcheck
`/api/stats` et la politique de redémarrage.

---

## 9. API REST

Toutes les réponses suivent la même enveloppe :

```json
{ "success": true, "data": {}, "meta": { "page": 1, "perPage": 12, "total": 30, "totalPages": 3 } }
```

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Données invalides", "details": {} } }
```

| Méthode | Route | Accès | Rôle |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` · `/api/auth/login` · `/api/auth/logout` | public | session cookie httpOnly |
| `GET` | `/api/auth/me` | connecté | profil + vue d ensemble |
| `GET` `POST` | `/api/categories` | public / admin | catégories |
| `GET` `PATCH` `DELETE` | `/api/categories/[id]` | public / admin | détail catégorie |
| `GET` `POST` | `/api/courses` | public / admin | catalogue paginé et filtré |
| `GET` `PATCH` `DELETE` | `/api/courses/[id]` | public / admin | détail cours |
| `GET` `POST` | `/api/lessons` | public / admin | leçons |
| `GET` `PATCH` `DELETE` | `/api/lessons/[id]` | public / admin | détail leçon |
| `POST` | `/api/lessons/[id]/complete` | connecté | valide la leçon, crédite l XP, recalcule le cours |
| `GET` `POST` | `/api/exercises` | public / admin | exercices (sans les bonnes réponses) |
| `GET` `PATCH` `DELETE` | `/api/exercises/[id]` | public / admin | détail exercice |
| `POST` | `/api/exercises/[id]/submit` | connecté | correction serveur, score, XP, badges |
| `GET` `POST` | `/api/flashcards` et `/api/flashcards/[id]` | public / admin | cartes mémoire |
| `GET` `POST` | `/api/review` | connecté | file de révision SM-2 et notation |
| `GET` | `/api/review/recommendations` | connecté | cours recommandés selon les erreurs |
| `GET` | `/api/progress` et `/api/progress/activity` | connecté | statistiques et série |
| `POST` | `/api/progress/time` | connecté | temps passé sur une leçon |
| `GET` `POST` `DELETE` | `/api/favorites` et `/api/favorites/[id]` | connecté | favoris |
| `GET` | `/api/search` | public | recherche instantanée multi-entités |
| `GET` | `/api/stats` | public | compteurs de la plateforme (cache 300 s) |
| `GET` | `/api/achievements` | connecté | badges et classement |
| `GET` `PATCH` | `/api/goals` | connecté | objectif quotidien |
| `GET` | `/api/admin/stats` et `/api/admin/users` | admin | pilotage |
| `PATCH` `DELETE` | `/api/admin/users/[id]` | admin | gestion des comptes |

Codes utilisés : `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `500`. Les erreurs
Prisma connues sont traduites (`P2002` vers `409`, `P2025` vers `404`) et les exceptions inattendues
ne fuient jamais leur message.

---

## 10. Tests

Vitest + React Testing Library, environnement jsdom, aucune base requise.

```bash
npm test              # exécution unique
npm run test:watch    # mode surveillance
npm run test:coverage # couverture
```

| Fichier | Couvre |
| --- | --- |
| `tests/unit/exercise-grading.test.ts` | correction par type, tolérance accents et casse, ordre des mots, associations, question non répondue, score global |
| `tests/unit/review-sm2.test.ts` | intervalles SM-2, réinitialisation sur `AGAIN`, bornes du facteur de facilité |
| `tests/unit/utils.test.ts` | XP et niveaux, normalisation de texte, slugs, durées, dates, tableaux, traducteur et interpolation |
| `tests/components/*.test.tsx` | `Button` (états, ARIA), `ProgressBar` (ARIA, bornes), `CourseCard` (FR/AR, liens, progression), `ExerciseRunner` (parcours complet de soumission) |
| `tests/api/handler.test.ts` | enveloppe de réponse, mapping des erreurs, `withAuth`, `withAdmin`, validation Zod, pagination |
| `tests/api/prisma-schema.test.ts` | présence des 17 modèles, provider PostgreSQL, alignement enums et constantes, cascades |
| `tests/api/i18n.test.ts` | dictionnaires FR et AR strictement synchronisés (327 clés), variables d interpolation préservées |

---

## 11. Accessibilité et performance

**Accessibilité (WCAG 2.1 AA visé)**

- Lien d évitement, `main` identifié, hiérarchie de titres respectée.
- Tous les contrôles sont atteignables au clavier ; `:focus-visible` global à 2 px avec offset.
- `aria-current` sur la navigation, `aria-pressed` sur les favoris, `role="progressbar"` complet,
  `aria-live` sur les toasts, `aria-busy` sur les boutons en cours de soumission.
- Icônes décoratives en `aria-hidden`, alternative textuelle pour les icônes seules.
- Palette contrastée, `prefers-reduced-motion` respecté.
- RTL géré par propriétés logiques, pas par surcharges miroir fragiles.

**Performance**

- Server Components par défaut, `use client` réservé à l interactif.
- `revalidate` sur l accueil (300 s) et `/api/stats`, invalidation par tags (`lib/cache.ts`).
- Pagination serveur systématique (`skip`/`take`) et `$transaction` pour coupler liste et total.
- `next/image` (AVIF/WebP), `next/font` avec `display: swap`, `optimizePackageImports` sur
  `lucide-react`, `recharts` et `date-fns`.
- `loading.tsx` et squelettes pour un rendu progressif, recherche débouncée avec annulation.
- Sortie `standalone` pour une image Docker minimale.

**Sécurité**

Cookie `httpOnly` avec `sameSite=lax` et `secure` en production, mots de passe bcrypt (12 tours),
en-têtes `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
double garde admin (middleware Edge puis vérification serveur), `passwordHash` jamais sérialisé.

---

## 12. Commandes utiles

| Commande | Effet |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | `prisma generate` puis build de production |
| `npm start` | serveur de production |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | suite de tests |
| `npm run format` | Prettier + tri des classes Tailwind |
| `npm run prisma:studio` | explorateur de base |
| `npm run db:seed` | contenu de démonstration |
| `npm run db:reset` | réinitialisation complète |
| `docker compose up --build` | pile complète en conteneurs |

---

## Licence

MIT.
