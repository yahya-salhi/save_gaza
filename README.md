# Save Gaza

A dark humanitarian data instrument for **verified casualty statistics, interactive maps, and crisis telemetry** for Gaza and the West Bank — built for advocates, researchers, journalists, and the general public.

> **Status:** active development (Phase 4 — Interactive Map & Spatial Telemetry). The landing, dashboard statistics, researcher export, and Gaza governorate map are live in development; submissions, auth, and moderation arrive in Phase 5.

## Features

- **Instrument Hero** — verified casualty tally in mono type with a live timestamped ticker, breakdown strips, and West Bank / Lebanon scope
- **Dashboard** — Gaza and West Bank daily tallies with per-report deltas, context breakdowns (children, women, press, medical, civil defence), and reporting metadata
- **Time-series analytics** — URL-synced date-range trends (killed/injured), verified-demographics donut with last-verified fallback, all charts lazy-loaded
- **Researcher export** — one-click CSV/JSON download of the in-view history window (the API's sole raw-download exception)
- **Interactive Gaza map** — five clickable OSM-derived governorate outlines on a dark observatory canvas, with legend, labels, and selection state
- **Operational endpoints** — `/health` liveness and `/ready` readiness (DB latency + last-sync timestamp) probes

## Tech Stack

| Layer | Stack |
| ----- | ----- |
| Frontend | React 19 + Vite 8 SPA (JavaScript + JSDoc, `checkJs`), Tailwind CSS 4 + CSS Modules, `react-router-dom` v7 |
| State | TanStack Query v5 (server state) + Zustand (UI state) |
| Maps / Charts | Leaflet + react-leaflet (lazy), Recharts (lazy) |
| Backend | Node.js 20+ + Express 5 REST API (TypeScript strict), Prisma 7 + PostgreSQL 16 |
| Data | TechForPalestine v2/v3 proxy with in-memory TTL cache (stale-while-revalidate); Redis seam reserved |
| Validation | Zod on both client inputs and server API boundaries |
| Testing | Vitest + React Testing Library (FE), Vitest + Supertest (BE), Playwright (E2E) |
| Design | “Refined Observatory” token system (`App.css`), full RTL readiness, logical CSS only |

## Monorepo Layout

```
savegaza/
├── frontend/src/
│   ├── features/      # Feature slices (summary, statistics, map, dashboard)
│   ├── pages/         # Route components (/, /app, /app/gaza, /app/westBank, /app/gazaMap, …)
│   ├── layouts/       # RootLayout, AppLayout, Navbar, Footer
│   ├── shared/        # Envelope API client, token primitives, providers, stores
│   └── App.css        # Canonical design tokens (:root)
├── backend/src/
│   ├── core/          # Pure domain layer (entities, errors, ports) — no framework imports
│   ├── application/   # Single-responsibility use cases
│   ├── infrastructure/# Prisma repositories, upstream clients, caches, static spatial data
│   ├── controllers/   # Express routes serving the standard envelope
│   └── middlewares/   # Envelope, errors, logging, rate-limiting, security
├── context/           # Architecture, build plan, tokens, progress tracker (start here)
└── docker-compose.yml # Local PostgreSQL 16
```

## Prerequisites

- Node.js ≥ 20 and npm ≥ 9
- Docker (for the local PostgreSQL database)

## Quickstart

```bash
npm install

# 1. Start PostgreSQL
docker compose up -d

# 2. Configure the backend
cp backend/.env.example backend/.env

# 3. Apply migrations
npm run db:migrate --workspace backend
# (or: cd backend && npx prisma migrate dev)

# 4. Run everything (backend :3000, frontend :5173)
npm run dev

# Or run each side individually
npm run dev:backend
npm run dev:frontend
```

Open http://localhost:5173 — the Vite dev server proxies `/api/*` to the backend.

## Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Backend + frontend dev servers |
| `npm run build` | Backend (`tsc`) then frontend (`vite build`) |
| `npm run start` | Serve production build (Express serves `frontend/dist` single-origin) |
| `npm run lint` | ESLint across workspaces |
| `npm run typecheck` | `tsc --noEmit` (BE) + `checkJs` (FE) |
| `npm run test` | Vitest suites across workspaces (285 tests: 204 FE + 81 BE) |

## API Overview

All JSON endpoints return the standard envelope `{ success, data, error, timestamp }`.
The sole exception is the researcher download, which streams raw file bytes.

| Endpoint | Description |
| -------- | ----------- |
| `GET /api/v1/summary` | Multi-region verified tally (5-min cache, SWR) |
| `GET /api/v1/statistics/gaza` | Latest Gaza daily record (DB-backed, 15-min cache) |
| `GET /api/v1/statistics/west-bank` | Latest West Bank telemetry (DB-backed, 15-min cache) |
| `GET /api/v1/statistics/history` | Range-filtered daily snapshots (paginated) |
| `GET /api/v1/statistics/export?format=csv\|json` | Whole-window researcher download (raw attachment) |
| `GET /api/v1/spatial/boundaries` | Gaza governorate GeoJSON (static, 24h cache + gzip) |
| `GET /health` · `GET /ready` | Liveness · readiness (DB latency + last sync) |

## Quality Gates

Every change is expected to pass, in order: `lint` → `typecheck` → `test` → `build`.
The production build asserts that no direct upstream API URLs leak into the client bundle —
in production all data flows through the same-origin backend proxy.

## Design System

The UI follows the **Refined Observatory** system: obsidian surfaces, one cool-crimson data accent,
and green reserved strictly for focus rings and 8px verified dots. Never hardcode colors, spacing,
radii, or shadows — consume `App.css` tokens (or their Tailwind mappings). Layout is RTL-ready:
logical CSS properties only, LTR-isolated tabular numerals. See `context/ui-tokens.md`,
`context/ui-rules.md`, and `context/ui-registry.md`.

## Documentation

The [`context/`](context/) directory is the source of truth: start with `project-overview.md`,
then `architecture.md`, `build-plan.md`, and `progress-tracker.md` for current slice status.

## Data Sources & Attribution

- Casualty statistics: [TechForPalestine](https://data.techforpalestine.org) (v2 daily feeds, v3 summary)
- Map tiles: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- Governorate boundaries: © OpenStreetMap contributors (ODbL)

## Roadmap

Next: per-governorate aggregates (`GET /api/v1/spatial/regions/:id`, Slice 4.2), then Phase 5 —
public incident submissions (Cloudflare Turnstile), JWT admin auth, and the moderation queue.
