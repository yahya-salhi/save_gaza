# Progress Tracker

Update this file after every completed slice. Any agent reading this should immediately know what is done, what is in progress, and what is next.

This is a **fresh-start, dual-track plan** aligned strictly to `architecture.md`, `build-plan.md`, and `AGENTS.md`.

> **GREENFIELD STATUS NOTICE:**  
> Zero application code exists in the repository today. Only `AGENTS.md` and `context/` exist.  
> Work begins at **Slice 0.1** to scaffold the monorepo from scratch.

---

## Slice Architecture & Engineering Gates

Every slice is implemented through explicit Clean Architecture layers:

### Backend (BE) Subslice Pattern
1. **Domain & Core (`backend/src/core/`)**:
   - Pure domain entities (`entities/`), domain error definitions (`errors/`), and interfaces/ports (`ports/`) with NO framework imports.
   - Strict contract validation using **Zod**.
2. **Infrastructure (`backend/src/infrastructure/`)**:
   - Isolated database access using **Prisma ORM** + PostgreSQL (`repositories/`).
   - Upstream TechForPalestine v2 API adapter (`external/`).
   - Redis & in-memory TTL cache adapters (`cache/`).
3. **Application (`backend/src/application/`)**:
   - Single-responsibility use cases orchestrating repository and cache ports (e.g., `SyncCasualtiesUseCase`, `GetSummaryUseCase`).
4. **Controllers & Routes (`backend/src/controllers/`)**:
   - Express router endpoints (`/api/v1/...`).
   - Standardized API Response Envelope `{ success, data, error, timestamp }` (with streaming raw exception for `/export`).
   - Global error middleware formatting domain errors into `{ code, message }`.
5. **BE Testing & Gates**:
   - Integration tests with Vitest + Supertest, DB tests against `DATABASE_URL_TEST`.

### Frontend (FE) Subslice Pattern
1. **Mock Fixtures (`__fixtures__/`)**:
   - Colocated mock payloads matching the unwrapped envelope shape.
2. **Four Visual States**:
   - Verification of **Loading**, **Empty**, **Error**, and **Populated** states against `ui-tokens.md` (`App.css` tokens).
3. **Data Wiring**:
   - TanStack Query hooks consuming `shared/api/client.js` via `apiGet(endpoint)`.
   - Direct upstream fallback strictly forbidden in production; allowed only in development when `VITE_API_BASE` is empty.
4. **FE Testing & Gates**:
   - Vitest + React Testing Library (RTL) component tests.

---

## Current Status

**Phase:** Phase 3 — Dashboard Shell & Statistics Engine  
**Last completed:** Slice 3.2.1 — PostgreSQL Provisioning & Baseline Migration  
**Next:** Slice 3.3 — West Bank Statistics & Aggregation (first feature born on the live DB)  

---

## Progress

### Phase 0 — Monorepo Scaffolding & Setup

- [x] **0.1 Monorepo Scaffolding & Project Initialization**
  - [x] **FE Subslice**: Scaffold `frontend/` using Vite + React (JavaScript/JSX), install dependencies (`tailwindcss`, `lucide-react`, `react-icons`, `@radix-ui/react-slot`, `@radix-ui/react-dialog`, `react-router-dom`, `@tanstack/react-query`, `zustand`, `zod`). Configure `checkJs: true` in `jsconfig.json`.
  - [x] **BE Subslice**: Scaffold `backend/` with TypeScript (`tsconfig.json`), Express, Prisma CLI, Zod, Winston, Helmet, CORS, and Supertest. Setup `prisma/schema.prisma` and `.env.example`.
  - [x] **DevOps**: Setup root `package.json` with npm workspaces or root convenience scripts (`npm run dev:frontend`, `npm run dev:backend`).

> **NOTE — Dependency versions (chosen by user, deviating from blueprint pins):** Stack built on **latest stable majors**: Vite 8, React 19, Tailwind CSS 4 (CSS-first `@theme` config, no `tailwind.config.js`), react-router-dom 7, Express 5, Prisma 7 (requires `prisma.config.ts` + `@prisma/adapter-pg` driver adapter; `url` moved out of `schema.prisma`), TypeScript 6, Vitest 5, Zod 4. Ahead of their dedicated slices, the scaffold already wires: `client.js` envelope (`apiGet`/`apiPost`/`apiPatch` + `ApiError`), `App.css` tokens, `ThemeProvider` + `I18nProvider` composed in the app root, the `/health` + `/ready` routes, the domain error base class + middleware, a **Winston logger** (`infrastructure/logger.ts`), and **Zod-validated backend config** (`config.ts` with lazy env parsing; `prismaClient.ts` reads `config.databaseUrl`). Backend uses `createApp()` (exported for Supertest) + `server.ts` entry with `dotenv/config`; `dist/` is emitted by `tsc` and run via `node dist/server.js`.

---

### Phase 1 — Foundation & Design System

- [x] **1.1 Design Tokens & Backend Environment**
  - [x] **FE Subslice**: Token set authored into `App.css` `:root` (obsidian surfaces, cool-crimson `--accent-500`, verified green `--verified`, `--text-on-accent`, `--overlay-bg`). Tailwind 4 CSS-first `@theme` mapping (no `tailwind.config.js`). Fonts (Archivo, IBM Plex Mono, Manrope).
  - [x] **BE Subslice**: Zod env schema validation (`PORT`, `CORS_ORIGIN`, `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `JWT_EXPIRY`, `JWT_REFRESH_EXPIRY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_SITE_KEY`, `SENTRY_DSN`). Lazy parsing with `validateEnv()` startup hook. 10 config tests.
- [x] **1.2 Providers & Backend Scaffolding**
  - [x] **FE Subslice**: Root composition: `ErrorBoundary` → `ThemeProvider` → `QueryClientProvider` → `I18nProvider` → `BrowserRouter`. ErrorBoundary with `getDerivedStateFromError` + fallback UI. 5 tests.
  - [x] **BE Subslice**: Helmet CSP (Google Fonts, OpenStreetMap, Turnstile-ready), CORS whitelist, Winston request logging, express-rate-limit (100/min general, 5/15min strict). `/health` liveness + `/ready` DB ping with graceful degradation. 14 tests.
- [x] **1.3 Shared UI Primitives & Domain Error Standard**
  - [x] **FE Subslice**: Primitives: `Card`, `Button`, `Skeleton`, `EmptyState`, `ErrorState`, `VerifiedDot`, `StatItem` with logical CSS properties and verified status dot (never green badge). All 7 built in `shared/ui/` with `@typedef` JSDoc types, Tailwind token classes, RTL-safe layout, and `forwardRef` on Card/Button.
  - [x] **BE Subslice**: Clean Architecture `core/errors` hierarchy (`DomainError`, `NotFoundError`, `ExternalApiError`, `ValidationError`) — already existed from scaffold. Global error middleware `errorHandler.ts` formats domain errors into `{ code, message }` inside envelope. `successResponse()` helper wraps controller returns.
  - [x] **Tests**: 49 new FE primitive tests (Card 7, Button 8, Skeleton 7, EmptyState 6, ErrorState 7, VerifiedDot 7, StatItem 9). Total: 59 FE + 32 BE = 91 tests passing.
- [x] **1.4 Layout Shells & API Gateway Routing**
  - [x] **FE Subslice**: `RootLayout` (Navbar + Footer) + `AppLayout` (dashboard shell with collapsible sidebar using `var(--sidebar-width)` and logical `inset-inline-start`).
  - [x] **BE Subslice**: Central router mounting under `/api/v1`. Static serving setup for `frontend/dist/` with single-origin SPA fallback.
  - [x] **Tests**: Shell layout mounting and drawer toggle tests.
- [x] **1.5 Data Envelope & Mock Foundation**
  - [x] **FE Subslice**: Envelope-aware `shared/api/client.js` (`apiGet`/`apiPost`/`apiPatch` + `ApiError`) unwraps `{ success, data, error, timestamp }`. Direct upstream calls blocked in production (same-origin `/api/v1`); dev-only fallback when `VITE_API_BASE` empty. `__fixtures__/` standard established — unwrapped payload in `features/[feature]/__fixtures__/[endpoint].js` + colocated `.fixture.test.js`.
  - [x] **BE Subslice**: Envelope helpers extracted to `middlewares/envelope.ts` (`successResponse`, `errorResponse`); `errorHandler.ts` and `app.ts` API-404 consume them. Controller returns wrapped via `successResponse`.
  - [x] **Tests**: Envelope helper + API shape tests; client unwrapping, error normalization, apiPost/apiPatch, non-JSON error handling. Total: 101 FE + 35 BE = 136 tests passing.

---

### Phase 2 — Landing — Instrument Hero & Summary Endpoint

- [x] **2.1 Hero UI & Summary API Contract**
  - [x] **FE Subslice**: Build Hero UI using `features/summary/__fixtures__/summary.js`: mono tally (`--text-4xl`, crimson), heading, caption, hairline rule, CTA to `/app`. All 4 states supported (loading / empty / error / populated via prop-driven status). Correlated the Slice 1.5 fixture to the **TechForPalestine v3 `summary.json`** nested multi-region shape (contract decision). Corrected fixture + fixture test (gaza / west_bank / lebanon / known_killed_in_gaza / known_press_killed_in_gaza). Home route `/` renders `HomePage` → `Hero`. Stubbed `useSummary` hook (`features/summary/hooks/useSummary.js`) for Slice 2.3 wiring. FE tests: 110 passing (+ fixture tests, +7 Hero, +1 HomePage).
  - [x] **BE Subslice**: Domain entity `Summary` (`core/entities/Summary.ts`), Zod `SummarySchema` (`core/schemas/summary.ts`), `SummaryFeedPort` (`core/ports/SummaryFeedPort.ts`), `GetSummaryUseCase` (`application/use-cases/`), external adapter `TechForPalestineSummaryClient` (`infrastructure/external/`), and controller `GET /api/v1/summary` mounted on `apiRouter`. Added `SUMMARY_FEED_URL` env (default v3 summary URL). Envelope + Zod validation at the application boundary; upstream failures map to `ExternalApiError` (502). BE tests: 39 passing (+ use case, + endpoint 200/502).
  - [x] **QA / a11y**: Numerals rendered LTR mono tabular with bidi isolation; heading/tally/caption hierarchy; CTA is a real `<Link>`.
- [x] **2.2 Live Ticker Motion & Backend Stale-While-Revalidate Caching**
  - [x] **FE Subslice**: `LiveTicker` (`features/summary/components/LiveTicker.jsx` + `.module.css`) — 8px `var(--accent-500)` pulsing dot, `aria-live="polite"`, LTR mono tabular timestamp with bidi isolation, `@media (prefers-reduced-motion: reduce)` disables pulse. Rendered inside `Hero` populated path. FE tests: 117 passing (+6 LiveTicker, +1 Hero ticker).
  - [x] **BE Subslice**: `CachePort` (`core/ports/CachePort.ts`) + `InMemoryCache` + `CachedSummaryFeed` decorator (`infrastructure/cache/`) — 5-min TTL, fresh hit short-circuits upstream, stale served on upstream failure, 502 only on cold start. No Redis dep (port seam keeps 6.3 path open). BE tests: 48 passing (+4 cache, +4 decorator, +1 stale endpoint).
- [x] **2.3 Wire Hero & Social Sharing (SEO)**
  - [x] **FE Subslice**: Wired `useSummary` into `HomePage` → `Hero` (live query replaces fixture; loading skeleton / human-readable error + retry / populated tally). Typed hook return as `UseQueryResult<SummaryData, Error>`.
  - [x] **BE Subslice**: Envelope-shape integration test (`success`/`data`/`error:null`/`timestamp` ISO) for `GET /api/v1/summary` 200.
  - [x] **SEO**: Static OpenGraph (`og:type/site_name/title/description`) + Twitter (`summary_large_image/title/description`) metadata in `index.html`; verified present in `dist/index.html`; prod bundle contains no `api/v2|api/v3` URLs.
  - [x] **Tests**: `useSummary` hook tests (fetch + error) + `HomePage` wiring tests (tally/loading/error+retry). Total: 122 FE + 49 BE = **171 tests passing**. Typecheck green both workspaces; production build green.

---

### Hero Full-Picture Upgrade (unreleased, post-2.3)

Instrument Hero upgrade without new tokens or dependencies — gives the whole picture in one screen:

- Kicker `Verified tally — documented daily` + `Save Gaza` H1 preserved for tests.
- Giant mono crimson tally (`--text-4xl`) + one-sentence lede (children / women / injured / reports from fixture).
- Breakdown strip (Children / Women / Injured) + West Bank + Lebanon scope line.
- Dual CTA (`View the data` → `/app`, ghost `Explore the map` → `/app/gazaMap`) + `/submit` microcopy.
- Trust row via `VerifiedDot` (8px green dot only) + `LiveTicker` still owns the timestamp.
- `Hero.module.css`: token-only glow + hairline grid, logical properties, rise-in with reduced-motion guard.
- Tests: 141 FE passing (kicker reworded to avoid colliding with `/live/i` ticker query). Build green.

### Phase 3 — Dashboard Shell & Statistics Engine

- [x] **3.1 Dashboard Shell & Readiness Detail**
  - [x] **FE Subslice**: Dashboard shell (`/app`): `DashboardPage` composing `DashboardHeader` ("WAR IN GAZA"), route-aware `Breadcrumbs`, static `HeaderMapBanner` (no Leaflet), `EmptyState` placeholder; mounted on `/app` in `App.jsx`. Sidebar active indicator verified as-is in `AppLayout`.
  - [x] **BE Subslice**: `/ready` keeps `{ status, db: { latencyMs, syncedAt } }` shape; `syncedAt` wired to last successful summary-cache write via `syncTracker` (recorded in `CachedSummaryFeed`, `null` before first sync); `degraded` = DB ping failed.
  - [x] **Tests**: 13 FE (Breadcrumbs 5, DashboardHeader 2, HeaderMapBanner 2, DashboardPage 4) + 3 BE (ready syncedAt/latency shape + post-sync ISO, cache sync-timestamp). Total: 141 FE + 52 BE = **193 tests passing**. Typecheck green both workspaces; prod build green; no `api/v2|api/v3` URLs in prod bundle.
- [x] **3.2 Gaza Daily Statistics & PostgreSQL Ingestion**
  - [x] **FE Subslice**: `GazaSummary` component (`features/statistics/GazaSummary.jsx` + `.module.css`) — custom field-tally card (no `StatItem`, no icons): massive LTR mono tabular killed/injured tally (`en-US` grouping, crimson severity bar), per-report delta strip, context breakdown (Children / Women / Press / Medical / CivDef / Massacres), meta footer (source / date / reporting window). Token-only CSS Module with logical properties. All 4 states (loading skeleton / error `role="alert"` / empty / populated). Wired into `DashboardPage` replacing the `EmptyState` placeholder. `useGazaDaily` hook (`features/statistics/hooks/useGazaDaily.js`) consuming `GET /api/v1/statistics/gaza` with 5-min staleTime and 30s refetch. Fixture at `features/statistics/__fixtures__/gaza.js` (`gazaLatestFixture`, enveloped shape used by fetch-mock hook/Dashboard tests).
  - [x] **BE Subslice**: Full-stack DB-backed ingestion pipeline — reused existing EAV `Statistic` model (no migration needed). Domain entities (`Statistic.ts`), Zod schema (`casualtiesDaily.ts`), ports (`CasualtiesFeedPort`, `StatisticRepositoryPort`), external adapter (`TechForPalestineCasualtiesClient`), repository (`PrismaStatisticRepository`), use case (`SyncCasualtiesUseCase`), cache decorator (`CachedGazaStatistics` with 15-min TTL stale-on-failure), controller (`GET /api/v1/statistics/gaza`) mounted on `apiRouter`. `CASUALTIES_FEED_URL` added to config schema. Verified fields only (`ext_*` extrapolated fields excluded).
  - [x] **Tests**: 5 BE controller tests (200 envelope, latest-date selection, 502 upstream failure, stale cache serve, ISO timestamp shape) + 3 FE hook tests (success, error, loading) + 5 FE DashboardPage tests (header, breadcrumbs, map banner, Gaza section render, loading skeleton). Total: 145 FE + 57 BE = **202 tests passing**. Typecheck green both workspaces; prod build green.
- [x] **3.2.1 PostgreSQL Provisioning & Baseline Migration** (built 2026-09-10; unblocks 3.3–3.5 with a live DB, upstream fallback kept)
  - [x] **FE Subslice**: None — no frontend changes; `GazaSummary`/`useGazaDaily` work unchanged against the same envelope.
  - [x] **BE Subslice**: Local Postgres 16 via `docker-compose.yml` (`savegaza-postgres`, named volume, healthcheck); real `DATABASE_URL` in `backend/.env` (gitignored; dummy retired); baseline Prisma migration `20260910075427_baseline` creating `statistics`/`incidents`/`users`/`audit_logs`. Verified live: `GET /api/v1/statistics/gaza` persisted 9,279 rows (2023-10-07 → 2026-09-09), `/ready` reports live DB latency (~3ms). Fallback order stays DB-first, upstream-on-failure. Note: killed a stale pre-migration dev server holding the dummy URL; restart dev servers after pulling this.
  - [x] **Tests**: New `PrismaStatisticRepository.test.ts` live-DB integration (round-trip, idempotent upsert, empty-region null; isolated `itest-*` region, skips without DB). Total: 145 FE + 60 BE = **205 tests passing**. Typecheck green.
- [ ] **3.3 West Bank Statistics & Aggregation** (first feature born on the live DB)
  - [ ] **FE Subslice**: West Bank view (`/app/westBank`): casualties, arrests, settler attacks, displacement cards.
  - [ ] **BE Subslice**: Use case and repository query for West Bank daily data. Controller `GET /api/v1/statistics/west-bank`.
  - [ ] **Tests**: West Bank repository tests and FE fixture tests.
- [ ] **3.4 Time-Series Analytics & Query Filtering**
  - [ ] **FE Subslice**: Recharts line chart + demographic pie chart + date range slider with URL sync.
  - [ ] **BE Subslice**: Controller query params: `GET /api/v1/statistics/history?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&page=1&limit=100` with Zod date validation, pagination, and DB index optimization.
  - [ ] **Perf**: Code-split Recharts via `React.lazy()`.
- [ ] **3.5 Wire Statistics & Data Export Streaming**
  - [ ] **FE Subslice**: Connect statistics pages and charts to query hooks; wire CSV and JSON download triggers.
  - [ ] **BE Subslice**: Streamed export endpoint `GET /api/v1/statistics/export?format=csv|json` returning raw attachment (documented envelope exception).
  - [ ] **Tests**: Export stream test and component render tests.

---

### Phase 4 — Interactive Map & Spatial Telemetry

- [ ] **4.1 Map Canvas & GeoJSON Spatial Boundary Service**
  - [ ] **FE Subslice**: Leaflet map container (`/app/gazaMap`) with token-driven GeoJSON boundary polygons.
  - [ ] **BE Subslice**: GeoJSON spatial boundary controller `GET /api/v1/spatial/boundaries` with compression and 24h cache.
  - [ ] **Perf**: Lazy load Leaflet and react-leaflet components.
- [ ] **4.2 RegionInfo Details Panel & Regional Spatial Aggregation**
  - [ ] **FE Subslice**: Sidebar details panel showing selected region metrics with empty selection prompt.
  - [ ] **BE Subslice**: Spatial aggregation controller `GET /api/v1/spatial/regions/:id` with in-memory polygon mapping.
- [ ] **4.3 Tooltip Overrides & Incident Marker Feeds**
  - [ ] **FE Subslice**: Leaflet tooltip and popup `:global()` CSS Module overrides with logical properties and obsidian surfaces.
  - [ ] **BE Subslice**: Incident markers telemetry endpoint `GET /api/v1/incidents/pins?bbox=minLng,minLat,maxLng,maxLat`.
- [ ] **4.4 Wire Spatial Engine & Redis Bounding-Box Caching**
  - [ ] **FE Subslice**: Connect map interactions to spatial query hooks with bounding box caching.
  - [ ] **BE Subslice**: Redis spatial caching with 15-minute TTL.
  - [ ] **Tests**: Map marker interaction tests and spatial endpoint integration tests.

---

### Phase 5 — Submissions, Auth & Moderation Workflow

- [ ] **5.1 Public Submission Form & Prisma Incident Model**
  - [ ] **FE Subslice**: Public report form (`/submit`): title, date, coordinates, description, source links. Client Zod validation with 4 form states.
  - [ ] **BE Subslice**: Prisma schema migration for `Incident` entity (PENDING | APPROVED | REJECTED). Repository with `createUnverified()`.
- [ ] **5.2 Wire Submission & Cloudflare Turnstile Verification**
  - [ ] **FE Subslice**: Cloudflare Turnstile anti-bot widget embedded in form.
  - [ ] **BE Subslice**: Turnstile server verification middleware. Controller `POST /api/v1/incidents` inserting unverified record. Rate limiting (max 5/hour/IP).
  - [ ] **Sec**: Strict input sanitization with DOMPurify against XSS in description and source links.
- [ ] **5.3 Admin Authentication & JWT / RBAC Engine**
  - [ ] **FE Subslice**: Admin login view (`/login`): email, password, remember-me. Auth store in Zustand.
  - [ ] **BE Subslice**: Prisma `User` schema. Controller `POST /api/v1/auth/login`, `/refresh`, `/logout`. Bcrypt hashing, short-lived JWT access token + HttpOnly Secure SameSite=Strict refresh cookie. RBAC middleware (`requireRole('ADMIN')`).
  - [ ] **Tests**: Auth unit tests (login success, bad password, token refresh, expired token rejection).
- [ ] **5.4 Moderation Queue Dashboard & Pending Incidents API**
  - [ ] **FE Subslice**: Admin moderation view (`/admin/moderation`): queue table, status tags, preview modal.
  - [ ] **BE Subslice**: Controller `GET /api/v1/admin/incidents/pending` with pagination (`?page=1&limit=20`) and filters.
- [ ] **5.5 Wire Moderation Actions & Audit Trail**
  - [ ] **FE Subslice**: Approve and Reject action buttons with optimistic UI removal and undo toast.
  - [ ] **BE Subslice**: Controller `PATCH /api/v1/admin/incidents/:id/status`. Prisma `AuditLog` table and transaction recording moderator action.
  - [ ] **Tests**: RBAC guard tests and audit log assertions.

---

### Phase 6 — Cross-Cutting Hardening & Production Polish

- [ ] **6.1 Full i18n Localization & Arabic RTL Mirroring**
  - [ ] **FE Subslice**: Externalize all UI copy into translation keys (`locales/en.json`, `locales/ar.json`). Language switcher toggling `dir="rtl"` on `<html>`. Verify numerals stay LTR tabular-nums.
  - [ ] **BE Subslice**: Localized error response messages based on request `Accept-Language` header.
- [ ] **6.2 Distributed Observability & Sentry Tracing**
  - [ ] **FE Subslice**: Sentry SDK initialization; capture frontend runtime errors with attached API `x-request-id`.
  - [ ] **BE Subslice**: Sentry Node SDK initialization. Winston logger formatting with timestamp, severity, and `x-request-id` correlation.
- [ ] **6.3 High-Throughput Caching & Bundle Optimization**
  - [ ] **FE Subslice**: Bundle analyzer check, chunk splitting for Leaflet/Recharts, font preloading. Core Web Vitals audit (LCP < 1.8s, CLS = 0, INP < 150ms).
  - [ ] **BE Subslice**: Redis caching layer operational with background refresh daemon for stale keys.
- [ ] **6.4 Comprehensive Accessibility (a11y) Audit**
  - [ ] **FE Subslice**: Full keyboard navigation audit (`--focus-ring`). ARIA live regions for live ticker. High contrast `@media (forced-colors: active)` verification.
  - [ ] **BE Subslice**: Accessible, human-readable error descriptions in envelope `error.message`.
- [ ] **6.5 Security Hardening & Compliance**
  - [ ] **FE Subslice**: CSP meta validation, client URL sanitization for incident links.
  - [ ] **BE Subslice**: Helmet security headers, CORS origin lockdown, global rate-limiting, and npm audit remediation.

---

### Phase 7 — Release Readiness & Deployment

- [ ] **7.1 Playwright End-to-End Test Suite**
  - [ ] **FE Subslice**: E2E test scripts covering critical journeys (Hero → Dashboard → Map → Submit → Moderate).
  - [ ] **BE Subslice**: Test environment database seeding and cleanup automation.
- [ ] **7.2 Unified CI Quality Pipeline**
  - [ ] **DevOps**: GitHub Actions pipeline: `lint` → `typecheck` (`tsc --noEmit` & `checkJs`) → `test` (Vitest) → `build` across both packages.
- [ ] **7.3 Production Build & Single-Origin Delivery**
  - [ ] **FE Subslice**: Production build generation (`npm run build` → `frontend/dist/`). Assertion test that no direct TechForPalestine URLs exist in bundle.
  - [ ] **BE Subslice**: Express static serving of `frontend/dist/` with single-origin routing. Run Prisma migrations `prisma migrate deploy`.
  - [ ] **DevOps**: Environment variables and secret audit (`.env.example` verified).
- [ ] **7.4 Documentation & Registry Synchronization**
  - [ ] Refresh `ui-registry.md`, `progress-tracker.md`, and context docs to reflect the shipped production reality.