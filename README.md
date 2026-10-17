# EINSOF — Site vitrine + machine de vente

Site premium « Obsidienne et Or » pour une agence digitale guinéenne :
18 pages publiques, chatbot vendeur IA (OpenRouter streaming + repli z-ai,
mode vocal Omnis), Espace équipe (13 onglets), blog, podcast, réservation
de démos, notifications push (PWA), i18n fr/en/es/zh/de.

## Stack

- **Next.js 16** (App Router) · React 19 · TypeScript · Tailwind 4 · shadcn/ui
- **Prisma 6 + SQLite** (`db/custom.db`) — production visée : PostgreSQL/Neon (voir `docs/DECISIONS.md`)
- **Bun** (scripts) ou npm/node — `z-ai-web-dev-sdk` (repli LLM, TTS/ASR)
- Déploiement : Vercel (cron quotidien dans `vercel.json`)

## Démarrage

```bash
bun install            # ou npm install
cp .env.example .env   # puis renseigner AU MINIMUM ADMIN_PASSWORD (≥ 8 car.)
bunx prisma db push    # crée/synchronise db/custom.db
bun run dev            # http://localhost:3000
```

Sans `OPENROUTER_API_KEY`, le chatbot utilise le repli z-ai.
Sans `RESEND_API_KEY`, les e-mails sont simulés et journalisés (onglet E-mails).

### Variables d'environnement

Voir `.env.example` — 14 variables documentées (marque, URL canonique,
WhatsApp, push VAPID, Resend, cron, SEO). **`ADMIN_PASSWORD` et `CRON_SECRET`
sont obligatoires** : le site refuse les connexions admin et les appels cron
sans elles (fail-closed).

## Commandes utiles

| Commande | Rôle |
|---|---|
| `bun run dev` / `build` / `start` | développement / build / production |
| `bun run seed` | contenu éditorial de démonstration |
| `bun run push:keys` | génère les clés VAPID de production |
| `bun run test:chatbot` | jeu des 100 questions (seuil ≥ 90 %) |
| `bunx prisma studio` | explorateur de base |

## Documentation interne

- `docs/DECISIONS.md` — choix d'architecture (éros sandbox → production)
- `docs/PROGRESS.md` — état livré, itérations
- `docs/TODO-HUMAN.md` — tâches client (H-01 → H-15)
- `docs/AUDIT-2026-10-17.md` — audit complet et correctifs (S-xx/F-xx)
- `worklog.md` — journal de développement détaillé

## Sécurité — à savoir

- La clé OpenRouter ayant fui dans l'ancien historique git a été **retirée de
  tout l'historique**, mais elle doit rester **révoquée** côté openrouter.ai.
- `.env` et `db/` ne sont jamais commités (`.gitignore`).
- Espace équipe : `/` → pied de page → « Espace équipe » (mot de passe =
  `ADMIN_PASSWORD`, session 8 h signée HMAC).
