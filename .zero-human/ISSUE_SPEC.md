# ABH-17: Habit Tracker

Build a small full-stack **Habit Tracker** app as a monorepo that deploys cleanly to Railway.


---
## FULL-STACK TECH CONTRACT (mandatory unless the request is explicitly frontend/static-only)

Deliver a REAL, wired-together full-stack app — buttons and forms MUST perform real actions that persist to a database via a backend API. Do NOT ship a static frontend with mocked data.

**Repository layout (Railway monorepo — REQUIRED):**
- **Frontend** (`apps/frontend/`): Next.js 14 App Router + TypeScript + `railway.toml`. UI fetches live data via `process.env.NEXT_PUBLIC_API_URL` (never hardcode localhost).
- **Backend** (`apps/backend/`): Node.js + Express + TypeScript + `pg` + `railway.toml`. Listens on `0.0.0.0` and `process.env.PORT` (default 8080). Reads `DATABASE_URL` + `ALLOWED_ORIGINS`. Exposes `GET /health` (JSON with db status), domain CRUD under `/api/...`, and auth (`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` returning/consuming JWT) when the app needs accounts. Every route MUST appear in the manifest's `requiredRoutes` as `"METHOD /full/path"` AND be listed via `routeMounts` when implemented as a mounted Express router — see DEPLOY_MANIFEST.template.json. `apps/backend/package.json` must define `build` (tsc), `start` (node dist/index.js), `main` = `dist/index.js`.
- **Database** (`database/schema.sql`): `CREATE TABLE IF NOT EXISTS` for domain tables (and `users` when auth is required). Idempotent seed rows use `ON CONFLICT DO NOTHING`.
- **Manifest** (`.zero-human/DEPLOY_MANIFEST.json`): must set `monorepoStructure.frontend=apps/frontend` and `monorepoStructure.backend=apps/backend` so Railway detection is deterministic.
- Optional root `package.json` workspaces is fine; do NOT put the Next app at repo root.

**Wiring rules:**
- Frontend → Backend over HTTP via `NEXT_PUBLIC_API_URL` (Railway injects `https://${{backend.RAILWAY_PUBLIC_DOMAIN}}`).
- Backend → Database via `DATABASE_URL` (Railway injects `${{Postgres.DATABASE_URL}}`). Parameterized queries only.
- CORS via `ALLOWED_ORIGINS` (Railway injects `https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}`).
- Keep imports/exports consistent so `npm run build` succeeds in BOTH `apps/frontend` and `apps/backend`.

**Speed:** Implement the complete layout in ONE pass. Do not invent alternate folder layouts.
