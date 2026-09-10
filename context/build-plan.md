# Build Plan

A comprehensive, dual-track (Frontend + Backend) architectural plan for Save Gaza. The unit of work is a **slice**, divided into explicit **Frontend (FE Subslice)** and **Backend (BE Subslice)** tasks so that both client and server advance together under Clean Architecture standards.

---

## Greenfield Notice: Monorepo Clean Start

**Zero application code exists today.** The repository currently contains only `AGENTS.md` and documentation in `context/`. 
Phase 0 begins with **Slice 0.1** (Monorepo Scaffolding & Tooling Initialization) to establish the directory structure, dependencies, and build pipelines from scratch.

---

## Core Principle — Dual-Track, UI-First & Mock-Data-First

Every slice follows a disciplined lifecycle:

1. **Backend (BE) Subslice**:
   - Clean Architecture: Domain Entities/Errors/Ports (`backend/src/core/`), Application Use Cases (`backend/src/application/use-cases/`), Infrastructure Adapters (`backend/src/infrastructure/` - Prisma DB, TechForPalestine v2 external client, Redis cache), and Controllers (`backend/src/controllers/`).
   - Standardized API response envelope `{ success, data, error, timestamp }` (with raw streaming strictly reserved for `/api/v1/statistics/export`).
   - Runtime contract validation via **Zod** on all request bodies, query params, and external API feeds.
   - Vitest + Supertest integration tests against test database.
2. **Frontend (FE) Subslice**:
   - **UI + mock** — build components against colocated `__fixtures__/` matching the unwrapped envelope payload.
   - **States** — verify all four states visually: **loading, empty, error, populated** (plus form states where relevant).
   - **Wire** — swap mock fixture for TanStack Query hook consuming `shared/api/client.js`.
   - **Tests** — Vitest + React Testing Library (RTL) component tests.

---

## Professional Standards & Engineering Policies

### 1. Production Data Boundary Policy
- In production (`import.meta.env.PROD`), `shared/api/client.js` routes all requests strictly through the same-origin backend proxy (`/api/v1`).
- Direct calls to `data.techforpalestine.org` are blocked in production. Direct upstream fallback is restricted strictly to local development (`import.meta.env.DEV === true` when `VITE_API_BASE` is empty).
- A production build test verifies that no external TechForPalestine URLs exist in the compiled client bundle.

### 2. QA & Testing Policy
- **Coverage**: Minimum 85% test coverage for core domain logic, repositories, and state machines.
- **Contract Testing**: Strict runtime validation using **Zod** on both client inputs and server API boundaries.
- **E2E Acceptance Testing**: Playwright test suite covering all critical humanitarian telemetry and crisis reporting user journeys (Hero → Dashboard → Maps → Submissions → Moderation).
- **CI Quality Gates**: GitHub Actions pipeline runs: `lint` (ESLint 9) → `typecheck` (`tsc --noEmit` on BE, `checkJs: true` on FE) → `test` (Vitest) → `build` across both packages.

### 3. Caching & Performance Policy
- **Backend High-Throughput Caching**:
  - Redis + in-memory TTL caching with stale-while-revalidate strategy for upstream TechForPalestine v2 daily feeds.
  - GeoJSON boundaries cached with long TTL (24h) and brotli/gzip compression.
  - Rate limiting & request throttling on public endpoints.
- **Frontend Optimization**:
  - Code-splitting with `React.lazy()` for heavy third-party bundles (Leaflet maps, Recharts).
  - Core Web Vitals Targets: **LCP < 1.8s**, **CLS = 0**, **INP < 150ms**.

### 4. UI Design System & Theming
- **Token Invariant**: Strict compliance with `ui-tokens.md` (**Refined Observatory** theme) — obsidian surfaces (`--bg`, `--surface-1..3`), cool-crimson data accent (`--accent-500`), and verified green (`--verified`) exclusively for focus rings and small 8px status indicator dots (never colored badges or buttons).
- **Zero Hardcoded Values**: Prohibit raw hex (`#fff`, `#000`), arbitrary rem spacing, or custom shadows.

### 5. SEO & Social Metadata
- Build-time static OpenGraph and Twitter card metadata in `index.html` ensures humanitarian awareness links render informative previews when shared on social networks.

### 6. Accessibility (a11y) & Internationalization (i18n / RTL)
- **WCAG 2.1 AA Compliance**: Visible keyboard focus indicators via `--focus-ring`.
- **RTL & Logical CSS**: Direction-agnostic layout using CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline-start/end`).
- **Numerals**: Digits remain LTR monospace tabular-nums (`tabular-nums`) with bidi-isolation (`unicode-bidi: isolate`) even when Arabic RTL layout is active.

---

## Phases & Feature Slices Overview

| Phase | Theme | Slices | FE Focus | BE Focus |
| ----- | ----- | ------ | -------- | -------- |
| 0 | Monorepo Setup & Scaffolding | 1 | Scaffold `frontend/` (Vite, React 18, Tailwind) | Scaffold `backend/` (Express, Prisma, TypeScript) |
| 1 | Foundation & Design System | 5 | Design Tokens, Providers, UI Primitives, Shells | Client envelope standard, Docker PG, Prisma setup |
| 2 | Landing — Instrument Hero | 3 | Ticker, Hero UI, 4 States, CTA | `/api/v1/summary`, proxy caching, stale-while-revalidate |
| 3 | Dashboard Shell & Statistics | 6 | Gaza & West Bank grids, Recharts, Export UI | Postgres provisioning + baseline migration, `/api/v1/statistics/*`, DB sync use-case, CSV/JSON export |
| 4 | Interactive Map & Telemetry | 4 | Leaflet container, GeoJSON, RegionInfo, Popups | `/api/v1/spatial/*`, `/api/v1/incidents/pins`, Redis cache |
| 5 | Submissions, Auth & Moderation | 5 | Form UI, Zod validation, Login, Moderation | Turnstile verification, JWT HttpOnly auth, RBAC, DB CRUD |
| 6 | Cross-Cutting Hardening | 5 | RTL/i18n, client Sentry, a11y audit, code-splitting | Server Sentry, Winston correlation, security headers, rate limit |
| 7 | Release Readiness | 4 | Playwright E2E, production build check | Express static SPA serving, DB migrations, CI pipeline |
| | **Total** | **33** | | |