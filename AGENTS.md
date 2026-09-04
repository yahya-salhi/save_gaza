---
description: Instructions for building the Save Gaza React + Vite dashboard
globs: *
alwaysApply: true
---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

The **frontend** is a **React 18 + Vite single-page app** — there is no Next.js, no SSR, and no app/pages router. Ignore Next.js conventions from your training data. Routing is `react-router-dom` v6; styling is Tailwind CSS (shared UI/layouts) + CSS Modules with `App.css` tokens (dashboard features). This is a **monorepo**: the SPA lives in `frontend/`, and an **Express + Prisma + PostgreSQL backend** in `backend/` proxies the TechForPalestine v2 API, serves DB-backed statistics, and serves the built SPA. The frontend talks to the backend through an **envelope-aware client** (`shared/api/client.js`) — it does not call external APIs directly in production. Read `context/architecture.md` and `context/library-docs.md` before writing any code.

<!-- END:nextjs-agent-rules -->

## Read Before Anything Else

Read in this exact order before any implementation:

1. context/project-overview.md
2. context/architecture.md
3. context/ui-tokens.md
4. context/ui-rules.md
5. context/ui-registry.md
6. context/code-standards.md
7. context/library-docs.md
8. context/build-plan.md
9. context/progress-tracker.md

## Greenfield Clean-Start Invariant

**Zero application code exists today.** The repository contains only `AGENTS.md` and the `context/` blueprint. Work begins at **Slice 0.1** to scaffold the frontend and backend from scratch. Do not assume any pre-existing files, tables, or providers exist.

## Rules That Never Change

- Build **UI-first, mock-data-first** — full UI with colocated mock fixtures and all four states (loading / empty / error / populated) before wiring real data (see `context/build-plan.md`)
- Never hardcode hex, spacing, radii, or shadows — always use tokens (`var(--accent-*)`, `var(--surface-*)`, `var(--text-*)`, `--space-*`, `--radius-*`, `--elevation-*`) from `App.css` or their mapped Tailwind classes
- Layout is strictly RTL-ready — use logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline-*`), never physical left/right
- Numbers in RTL must preserve LTR order with mono tabular digits: `<span dir="ltr" className="tabular-nums font-mono [unicode-bidi:isolate]">`
- Green (`--verified`) is reserved strictly for focus rings and 8px status dots — never for full green buttons or badges
- Update `progress-tracker.md` and `ui-registry.md` after every completed slice
- Ask before adding a new dependency or changing a major version
- If the same problem persists after one corrective prompt — stop immediately and run /recover

## Data Layer & Integrations Overview

- **Data Source**: TechForPalestine v2 JSON (`https://data.techforpalestine.org/api/v2/`). The **backend** proxies it with Redis / in-memory TTL caching and DB persistence; the frontend reads strictly via `shared/api/client.js`
- **Production Data Boundary**: In production (`import.meta.env.PROD`), all calls go to the same-origin backend `/api/v1`. Direct external calls are forbidden. Direct upstream fallback is allowed only in development (`import.meta.env.DEV === true` when `VITE_API_BASE` is empty)
- **Response Envelope**: All JSON API endpoints strictly return `{ success, data, error, timestamp }`. The sole documented streaming exception is `GET /api/v1/statistics/export`
- **Routing**: `react-router-dom` v6 (`BrowserRouter`, `/`, `/app`, `/app/gaza`, `/app/westBank`, `/app/gazaMap`, `/submit`, `/login`, `/admin/moderation`)
- **State Management**: TanStack Query (server state) + Zustand (UI state: drawer, theme, filters). All providers live in `src/shared/providers/`
- **Maps**: Leaflet + react-leaflet with GeoJSON governorate boundaries and `:global()` popup CSS Module overrides
- **Charts**: Recharts (line + pie) lazy-loaded inside responsive card containers
- **Icons**: `react-icons/fa` (stat categories) + `lucide-react` (UI chrome)