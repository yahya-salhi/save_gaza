# UI Registry

Canonical registry of components built to the current plan (**Refined Observatory** tokens).

---

## Greenfield Reset Invariant

**Zero application code exists in the repository today.** All entries below represent the target components to be built slice by slice starting with Phase 0 and Phase 1. As each component is built and verified across all four states, its final path and properties are locked here.

---

## How to Use

Before building a component:
1. Check if a canonical primitive already exists below.
2. If yes — reuse it and match its token usage.
3. If no — build following `ui-tokens.md` and `ui-rules.md`, verify all four states, then register it here.

---

## Built So Far (Slice 0.1)

| Item | Final Path | Status |
| ---- | ---------- | ------ |
| Design tokens `:root` | `frontend/src/App.css` | ✅ Built |
| Tailwind 4 `@theme` mapping | `frontend/src/App.css` | ✅ Built |
| Route placeholder shell | `frontend/src/App.jsx` | ✅ Built (all routes stub) |
| Envelope client | `frontend/src/shared/api/client.js` | ✅ Built (`apiGet`/`apiPost`/`apiPatch`) |
| `ThemeProvider` | `frontend/src/shared/providers/ThemeProvider.jsx` | ✅ Built (hooks ready) |
| `I18nProvider` | `frontend/src/shared/providers/I18nProvider.jsx` | ✅ Built (scaffold) |
| `ErrorBoundary` | `frontend/src/shared/providers/ErrorBoundary.jsx` | ✅ Built (class component, getDerivedStateFromError) |

## Built So Far (Slice 1.3)

| Primitive | Final Path | Status | Tests |
| --------- | ---------- | ------ | ----- |
| `Card` | `frontend/src/shared/ui/Card.jsx` | ✅ Built | 7 tests |
| `Button` | `frontend/src/shared/ui/Button.jsx` | ✅ Built (Radix Slot, primary/ghost variants) | 8 tests |
| `Skeleton` | `frontend/src/shared/ui/Skeleton.jsx` | ✅ Built (animate-pulse, aria-busy) | 7 tests |
| `EmptyState` | `frontend/src/shared/ui/EmptyState.jsx` | ✅ Built (muted text + action slot) | 6 tests |
| `ErrorState` | `frontend/src/shared/ui/ErrorState.jsx` | ✅ Built (danger dot + retry button) | 7 tests |
| `VerifiedDot` | `frontend/src/shared/ui/VerifiedDot.jsx` | ✅ Built (8px green dot, never badge) | 7 tests |
| `StatItem` | `frontend/src/shared/ui/StatItem.jsx` | ✅ Built (mono tabular-nums, bidi-isolated) | 9 tests |

### BE Error Handling (Slice 1.3)

| Item | Final Path | Status |
| ---- | ---------- | ------ |
| Domain errors (`DomainError`, `NotFoundError`, `ExternalApiError`, `ValidationError`) | `backend/src/core/errors/DomainError.ts` | ✅ Built |
| Global error middleware | `backend/src/middlewares/errorHandler.ts` | ✅ Built (envelope format) |
| `successResponse()` helper | `backend/src/middlewares/errorHandler.ts` | ✅ Built |

## Built So Far (Slice 1.4)

### Layout Shells (FE)

| Item | Final Path | Status | Tests |
| ---- | ---------- | ------ | ----- |
| `Navbar` | `frontend/src/shared/ui/Navbar.jsx` | ✅ Built (logo, Dashboard/Report links, hamburger toggle, backdrop blur) | 8 tests |
| `Footer` | `frontend/src/shared/ui/Footer.jsx` | ✅ Built (hairline border, TechForPalestine link, copyright) | 5 tests |
| `RootLayout` | `frontend/src/layouts/RootLayout.jsx` | ✅ Built (Navbar + Outlet + Footer) | 6 tests |
| `AppLayout` | `frontend/src/layouts/AppLayout.jsx` | ✅ Built (collapsible sidebar, desktop persistent + mobile drawer, `--overlay-bg` backdrop) | 10 tests |
| `useUiStore` | `frontend/src/shared/stores/uiStore.js` | ✅ Built (Zustand sidebarOpen/toggle/open/close) | — |

### API Gateway Routing (BE)

| Item | Final Path | Status |
| ---- | ---------- | ------ |
| Central API router (`/api/v1`) | `backend/src/controllers/apiRouter.ts` | ✅ Built (mounting point for future controllers) |
| Static SPA serving + catch-all | `backend/src/app.ts` | ✅ Built (`express.static` + SPA fallback, API 404 envelope) |

### Tests (Slice 1.4)

Total: 88 FE + 34 BE = **122 tests passing**. Typecheck green on both workspaces.

> Canonical primitives (`Card`, `Button`, `StatItem`, `Skeleton`, `EmptyState`, `ErrorState`, `VerifiedDot`) are **built in Slice 1.3** — see below.

## Built So Far (Slice 1.5)

### Data Envelope & Mock Foundation (FE)

| Item | Final Path | Status | Tests |
| ---- | ---------- | ------ | ----- |
| Envelope client (`apiGet`/`apiPost`/`apiPatch` + `ApiError`) | `frontend/src/shared/api/client.js` | ✅ Verified + expanded tests — unwraps `{ success, data, error, timestamp }`, prod blocks upstream | 11 tests |
| `__fixtures__/` standard | `frontend/src/features/summary/__fixtures__/summary.js` | ✅ Established — unwrapped payload colocated per feature | 5 fixture tests |

Fixture standard: each feature stores mock payload at `features/[feature]/__fixtures__/[endpoint].js` exporting the **unwrapped** `data` shape (what `apiGet` returns after stripping the envelope), plus a colocated `[endpoint].fixture.test.js` asserting it models the unwrapped contract (no `success`/`error`/`timestamp` keys).

### Response Envelope (BE)

| Item | Final Path | Status |
| ---- | ---------- | ------ |
| `successResponse()` / `errorResponse()` helpers | `backend/src/middlewares/envelope.ts` | ✅ Built (dedicated middleware file) |
| Global error middleware | `backend/src/middlewares/errorHandler.ts` | ✅ Refactored to consume `errorResponse`; re-exports `successResponse` |
| API 404 envelope handler | `backend/src/app.ts` | ✅ Uses `errorResponse("NOT_FOUND", ...)` |
| Health controller | `backend/src/controllers/healthController.ts` | ✅ Import updated to `middlewares/envelope.js` |

### Tests (Slice 1.5)

Total: 101 FE + 35 BE = **136 tests passing** (+5 BE envelope, +8 FE client, +5 FE fixture). Backend vitest config added to scope tests to `src/` (excludes compiled `dist/`). Typecheck green on both workspaces; production build green.

## Built So Far (Slice 2.1)

### Hero UI & Summary API Contract (FE)

| Item | Final Path | Status | Tests |
| ---- | ---------- | ------ | ----- |
| `Hero` | `frontend/src/features/summary/components/Hero.jsx` | ✅ Field-ledger plate — entry strip (№ reports / TFP v3 / Gaza), whisper H1, bone-white mono tally (`--text-4xl`) with crimson rule, lede + breakdown + WB/Lebanon scope, dual CTA + submit link, `VerifiedDot` trust row; 4 states prop-driven, ticker owns date | 9 tests + 3 HomePage |
| `Hero.module.css` | `frontend/src/features/summary/components/Hero.module.css` | ✅ Ledger plate signature — corner ticks, entry strip, ledger-rule field, `--elevation-3` plate, crimson-topped breakdown grid; token-only, logical props, single rise-in + reduced-motion guard | — |
| `HomePage` | `frontend/src/pages/HomePage.jsx` | ✅ Built — renders Hero populated from summary fixture (Slice 2.1) | 1 test |
| `useSummary` | `frontend/src/features/summary/hooks/useSummary.js` | ✅ Stubbed — `useQuery(["summary"], apiGet("/summary"))`; wiring into Hero on Slice 2.3 | — |
| Summary fixture (corrected to v3 shape) | `frontend/src/features/summary/__fixtures__/summary.js` | ✅ Corrected to TechForPalestine **v3** `summary.json` nested multi-region shape (gaza / west_bank / lebanon / known_killed_in_gaza / known_press_killed_in_gaza) | 9 fixture tests |

> **Contract decision (Slice 2.1):** `GET /api/v1/summary` and the FE fixture standardize on the TechForPalestine **v3** `summary.json` nested multi-region shape, replacing the earlier flat Snapshot 1.5 fixture. Dev-only `client.js` fallback for `/summary` points at `api/v3/summary.json`.

### Summary API Contract (BE)

| Item | Final Path | Status | Tests |
| ---- | ---------- | ------ | ----- |
| `Summary` entity | `backend/src/core/entities/Summary.ts` | ✅ Built | — |
| `SummarySchema` (Zod) | `backend/src/core/schemas/summary.ts` | ✅ Built | — |
| `SummaryFeedPort` | `backend/src/core/ports/SummaryFeedPort.ts` | ✅ Built | — |
| `GetSummaryUseCase` | `backend/src/application/use-cases/GetSummaryUseCase.ts` | ✅ Built | 2 tests |
| `TechForPalestineSummaryClient` | `backend/src/infrastructure/external/TechForPalestineSummaryClient.ts` | ✅ Built (implements SummaryFeedPort, async `fetch`, ExternalApiError on failure) | — |
| Summary controller | `backend/src/controllers/summaryController.ts` | ✅ Built + mounted on `apiRouter` | 2 endpoint tests |
| `SUMMARY_FEED_URL` env | `backend/src/config.ts` | ✅ Added (default v3 summary URL) | — |

### Tests (Slice 2.1)

Total: 110 FE + 39 BE = **149 tests passing** (+9 FE, +4 BE). Typecheck green on both workspaces; production build green.

## Built So Far (Slice 2.2)

### Live Ticker (FE)

| Item | Final Path | Status | Tests |
| ---- | ---------- | ------ | ----- |
| `LiveTicker` | `frontend/src/features/summary/components/LiveTicker.jsx` | ✅ Built — 8px `var(--accent-500)` pulse dot, `aria-live="polite"`, LTR mono tabular date, `prefers-reduced-motion` disables pulse; rendered in `Hero` populated path | 6 tests |
| `LiveTicker.module.css` | `frontend/src/features/summary/components/LiveTicker.module.css` | ✅ Built — token-only (`--accent-500`, `--space-2`, `--text-3`, `--font-mono`), logical layout, no hardcoded hex | — |

### Summary SWR Cache (BE)

| Item | Final Path | Status |
| ---- | ---------- | ------ |
| `CachePort` | `backend/src/core/ports/CachePort.ts` | ✅ Built (`get` fresh-only / `getStale` / `set` / `clear`) |
| `InMemoryCache` | `backend/src/infrastructure/cache/InMemoryCache.ts` | ✅ Built (TTL map, keeps expired for stale fallback) |
| `CachedSummaryFeed` | `backend/src/infrastructure/cache/CachedSummaryFeed.ts` | ✅ Built (decorator over `SummaryFeedPort`; 5-min TTL; stale-on-failure, 502 cold start) |
| Summary wiring | `backend/src/controllers/summaryController.ts` | ✅ Wired (exports `summaryCache` for test isolation) |

### Tests (Slice 2.2)

Total: 117 FE + 48 BE = **165 tests passing** (+7 FE, +9 BE). Typecheck green on both workspaces; production build green.

## Built So Far (Slice 2.3)

### Wire Hero & Social Sharing (FE)

| Item | Final Path | Status | Tests |
| ---- | ---------- | ------ | ----- |
| `HomePage` (live wiring) | `frontend/src/pages/HomePage.jsx` | ✅ Wired — `useSummary` → `Hero` (`summary ?? null`, `isLoading`, `isError`, `onRetry=refetch`) | 3 wiring tests |
| `useSummary` (typed) | `frontend/src/features/summary/hooks/useSummary.js` | ✅ Typed `UseQueryResult<SummaryData, Error>`; `queryKey ["summary"]`, `apiGet("/summary")`, 5-min stale | 2 hook tests |
| SEO metadata | `frontend/index.html` | ✅ Static OG (`og:type/site_name/title/description`) + Twitter (`summary_large_image/title/description`) | verified in `dist/` |

### Tests (Slice 2.3)

Total: 122 FE + 49 BE = **171 tests passing** (+5 FE, +1 BE). Typecheck green on both workspaces; production build green; no `api/v2|api/v3` URLs in prod bundle.

## UI Cleanup Pass (unreleased, post-2.3)

Root causes of the "messy" landing, all fixed without new tokens or dependencies:

| Fix | File | Detail |
| --- | ---- | ------ |
| Global anchor override removed | `frontend/src/App.css` | Unlayered `a { color: accent }` beat Tailwind utilities → red nav + invisible CTA text. Anchors now inherit; components own color via utilities. |
| Active section indicator | `shared/ui/Navbar.jsx` | `NavLink` with `aria-current`; active link `text-accent-500 semibold`, logo `text-text-1 font-black`. |
| Footer nav row | `shared/ui/Footer.jsx` | Dashboard / Report / Admin links above attribution. |
| Single timestamp + provenance | `features/summary/components/Hero.jsx` | Ticker owns the date; caption is now provenance copy. Tally pinned to `en-US` grouping (`73,658`). |
| Vertical centering | `layouts/RootLayout.jsx` + `Hero.jsx` | `main` is `flex-col`; hero `flex-1 justify-center` fills viewport instead of leaving a void. |
| Placeholder pages | `frontend/src/App.jsx` | `PlaceholderPage` uses `EmptyState` primitive instead of inline styles. |
| Favicon + theme-color | `frontend/index.html` | Inline SVG (crimson dot on obsidian) kills the 404; `theme-color #0b0d0f`. |
| Button token padding | `shared/ui/Button.jsx` | Base had no padding (cramped CTA); now `px-[var(--space-5)] py-[var(--space-3)]` per spec. Verified in `dist` CSS. |

Tests: 128 FE passing (+6 cleanup regression tests: CTA contrast, single timestamp, nav active/logo color, footer nav, button padding). Typecheck + prod build green.

## Built So Far (Slice 3.1)

### Dashboard Shell (FE — shell-chrome-only, no stat grid until 3.2)

| Item | Final Path | Status | Tests |
| ---- | ---------- | ------ | ----- |
| `Breadcrumbs` | `frontend/src/features/dashboard/components/Breadcrumbs.jsx` | ✅ Built — route-aware via `useLocation` (Home / Dashboard [/ Gaza \| West Bank \| Map]), links + `aria-current="page"`, `aria-label="Breadcrumb"` | 5 tests |
| `DashboardHeader` | `frontend/src/features/dashboard/components/DashboardHeader.jsx` | ✅ Built — static "WAR IN GAZA" display heading (`font-display text-2xl font-black uppercase`), accent eyebrow, subcopy | 2 tests |
| `HeaderMapBanner` | `frontend/src/features/dashboard/components/HeaderMapBanner.jsx` | ✅ Built — static strip (`role="img"` placeholder, crimson dot motif, token-only; no Leaflet, no fetching) | 2 tests |
| `DashboardPage` | `frontend/src/pages/DashboardPage.jsx` | ✅ Built — composes Breadcrumbs + Header + Banner + `EmptyState` placeholder; mounted on `/app` in `App.jsx` | 4 tests |

### Readiness Detail (BE)

| Item | Final Path | Status |
| ---- | ---------- | ------ |
| `syncTracker` (`recordSummarySync` / `getLastSummarySyncAt` / `resetLastSummarySyncAt`) | `backend/src/infrastructure/cache/syncTracker.ts` | ✅ Built (in-memory last-sync timestamp; Redis seam open for 6.3) |
| `CachedSummaryFeed` sync recording | `backend/src/infrastructure/cache/CachedSummaryFeed.ts` | ✅ Wired (records on successful upstream cache write) |
| `/ready` syncedAt | `backend/src/controllers/healthController.ts` | ✅ Wired (same `{ status, db: { latencyMs, syncedAt } }` shape; `degraded` = DB ping failed) |

### Tests (Slice 3.1)

Total: 141 FE + 52 BE = **193 tests passing** (+13 FE, +3 BE). Typecheck green both workspaces; prod build green; no `api/v2|api/v3` URLs in prod bundle.

## Built So Far (Slice 3.2)

### Gaza Daily Statistics (FE — custom tally card, no StatItem/icons)

| Item | Final Path | Status | Tests |
| ---- | ---------- | ------ | ----- |
| `GazaSummary` | `frontend/src/features/statistics/GazaSummary.jsx` | ✅ Built — field-tally card: killed/injured mono tabular tally (`en-US` grouping, bidi-isolated), per-report delta, context breakdown (Children/Women/Press/Medical/CivDef/Massacres), meta footer; 4 states (skeleton / `role="alert"` error / empty / populated) | covered via DashboardPage tests |
| `GazaSummary.module.css` | `frontend/src/features/statistics/GazaSummary.module.css` | ✅ Built — token-only (`--surface-1`, `--accent-500/300`, `--space-*`, `--radius-lg`, `--font-mono`), logical properties, severity bar + tally + delta + context grid + meta | — |
| `useGazaDaily` | `frontend/src/features/statistics/hooks/useGazaDaily.js` | ✅ Built — `queryKey ["statistics","gaza"]`, `apiGet("/api/v1/statistics/gaza")`, 5-min staleTime + 30s refetch | 3 hook tests |
| Gaza fixture | `frontend/src/features/statistics/__fixtures__/gaza.js` | ✅ Built — `gazaLatestFixture` (enveloped shape for fetch-mock hook/Dashboard tests; deviates from the Slice 1.5 unwrapped-fixture standard) | — |
| `DashboardPage` wiring | `frontend/src/pages/DashboardPage.jsx` | ✅ Wired — `GazaSummary` replaces the `EmptyState` placeholder below Breadcrumbs/Header/Banner | 5 DashboardPage tests |

### Gaza Ingestion Pipeline (BE — EAV Statistic reuse, no migration)

| Item | Final Path | Status |
| ---- | ---------- | ------ |
| `Statistic` entity + `GazaDaily` + `VERIFIED_GAZA_METRICS` | `backend/src/core/entities/Statistic.ts` | ✅ Built (`ext_*` excluded by contract) |
| `CasualtiesDailySchema` (Zod) | `backend/src/core/schemas/casualtiesDaily.ts` | ✅ Built (row array or `{ data }` envelope, passthrough) |
| `CasualtiesFeedPort` / `StatisticRepositoryPort` | `backend/src/core/ports/` | ✅ Built |
| `TechForPalestineCasualtiesClient` | `backend/src/infrastructure/external/TechForPalestineCasualtiesClient.ts` | ✅ Built |
| `PrismaStatisticRepository` | `backend/src/infrastructure/repositories/PrismaStatisticRepository.ts` | ✅ Built (EAV upsert on `@@unique([region, reportDate, type])`) |
| `SyncCasualtiesUseCase` | `backend/src/application/use-cases/SyncCasualtiesUseCase.ts` | ✅ Built (fetch → validate → upsert verified fields → latest-date snapshot) |
| `CachedGazaStatistics` (15-min TTL, stale-on-failure) | `backend/src/infrastructure/cache/CachedGazaStatistics.ts` | ✅ Built |
| Statistics controller (`GET /statistics/gaza`) | `backend/src/controllers/statisticsController.ts` | ✅ Built + mounted on `apiRouter` under `/statistics` |
| `CASUALTIES_FEED_URL` env | `backend/src/config.ts` | ✅ Added (default v2 `casualties_daily.json`) |

### Tests (Slice 3.2)

Total: 145 FE + 57 BE = **202 tests passing** (+4 FE incl. hook/Dashboard coverage, +5 BE controller). Verified 2026-09-10: `vitest run` green both workspaces (23 FE files / 11 BE files).

## Global Tokens & Utilities (`frontend/src/App.css`)

| Class / Token | Purpose |
| ------------- | ------- |
| `:root` variables | All design tokens — color / type / space / radius / elevation / motion (see `ui-tokens.md`) |
| `.card` | Generic card surface (`--surface-1`, hairline, `--elevation-1`) |
| `.cta` | Primary uppercase CTA (accent) |
| `h1`, `h2`, `p` | Global type defaults |
| `input`, `textarea` | Base form-field styling |

---

## Canonical Primitives (Phase 1 — built in Slice 1.3)

Shared, token-driven primitives every feature reuses. All are RTL-aware (logical properties) and cover all visual states.

| Primitive | Target File | Role | Key Tokens / Classes |
| --------- | ----------- | ---- | -------------------- |
| `Card` | `shared/ui/Card.jsx` | Surface container | `--surface-1`, `--hairline`, `--radius-md`, `--elevation-1` / `--elevation-2` hover |
| `Button` | `shared/ui/Button.jsx` | Primary / ghost action (Radix Slot) | `--accent-500/600`, `--focus-ring`, `--radius-md`, `--text-on-accent`, `--surface-3` ghost hover, token padding `px-[var(--space-5)] py-[var(--space-3)]` (added in UI cleanup — base had zero padding) |
| `StatItem` | `shared/ui/StatItem.jsx` | Icon + mono figure + label | `--surface-2`, `--accent-400`, `--font-mono` tabular-nums, `--surface-3` hover |
| `Skeleton` | `shared/ui/Skeleton.jsx` | Loading placeholder | `--surface-2`, `animate-pulse` |
| `EmptyState` | `shared/ui/EmptyState.jsx` | Neutral empty message | `--text-3` |
| `ErrorState` | `shared/ui/ErrorState.jsx` | Human-readable error + retry | `--danger` |
| `VerifiedDot` | `shared/ui/VerifiedDot.jsx` | 8px verified status dot + label | `--verified` (NEVER full green badge or background) |

---

## App Root Provider Composition (Slice 1.2)

Target file: `frontend/src/App.jsx` / `frontend/src/main.jsx`. Providers wrap from outer to inner:
`ErrorBoundary` $\rightarrow$ `ThemeProvider` $\rightarrow$ `QueryClientProvider` $\rightarrow$ `I18nProvider` $\rightarrow$ `BrowserRouter`.

| Provider / Boundary | Target File | Role | Notes |
| ------------------- | ----------- | ---- | ----- |
| `ErrorBoundary` | `shared/components/ErrorBoundary.jsx` | Top-level render crash fallback | Catches unhandled render errors; renders token-styled alert |
| `ThemeProvider` | `shared/providers/ThemeProvider.jsx` | Theme management | Toggles `dark` class on `<html>`, persists `sg-theme` in `localStorage` |
| `QueryClientProvider` | `App.jsx` | TanStack Query engine | Default `staleTime: 5m`, `retry: 1` |
| `I18nProvider` | `shared/providers/I18nProvider.jsx` | i18n scaffold | Provides `{ t, locale, dir }`; switches `dir="rtl"` on `<html>` |

---

## Target Component Catalog

| Component | Target Location | Category | Primary Tokens / Dependencies |
| --------- | --------------- | -------- | ----------------------------- |
| `RootLayout` | `layouts/RootLayout.jsx` | Layout Shell | `bg-bg`, `text-text-2`, Navbar + Outlet + Footer |
| `AppLayout` | `layouts/AppLayout.jsx` | Layout Shell | `bg-bg`, collapsible sidebar (`--sidebar-width`), logical properties |
| `Navbar` | `shared/ui/Navbar.jsx` | Navigation | `bg-bg/95`, backdrop blur, hamburger toggle, Radix Dialog mobile drawer |
| `Footer` | `shared/ui/Footer.jsx` | Navigation | `bg-bg`, hairline border, copyright |
| `Hero` | `features/summary/components/Hero.jsx` | Landing | `--text-4xl`, crimson mono tally, live ticker pulse |
| `LiveTicker` | `features/summary/components/LiveTicker.jsx` | Landing | Pulsing dot, `aria-live="polite"`, reduced-motion override |
| `GazaSummary` | `features/statistics/GazaSummary.jsx` | Statistics | ✅ Built (Slice 3.2) — custom field-tally card (no StatItem, no icons): mono tabular tally + delta + context grid + meta footer, 4 states |
| `WestBankSummary`| `features/statistics/components/WestBankSummary.jsx` | Statistics | Stat grid, 4 states, detainee/casualty cards |
| `TimeSeriesChart`| `features/statistics/components/TimeSeriesChart.jsx` | Charts | Recharts `ResponsiveContainer`, line chart, tooltip overrides |
| `DemographicPie` | `features/statistics/components/DemographicPie.jsx` | Charts | Recharts pie chart, demographics breakdown |
| `DateRangeSlider`| `features/statistics/components/DateRangeSlider.jsx`| Controls | Range selection, URL query parameter synchronization |
| `MapContainer` | `features/map/components/MapContainer.jsx` | Maps | Leaflet, GeoJSON boundary layers, custom tiles |
| `RegionInfo` | `features/map/components/RegionInfo.jsx` | Maps | Regional casualty details card, empty state prompt |
| `IncidentForm` | `features/submissions/components/IncidentForm.jsx` | Forms | 4 form states, Turnstile widget, Zod client validation |
| `AdminLogin` | `features/auth/components/AdminLogin.jsx` | Auth | Admin login form, JWT HttpOnly auth trigger |
| `ModerationQueue`| `features/moderation/components/ModerationQueue.jsx`| Admin | Queue table, preview modal, approve/reject actions |

---

## Route $\rightarrow$ Component Map (Target)

| Route | Primary Component | Layout Shell | Access Control |
| ----- | ----------------- | ------------ | -------------- |
| `/` | `Hero` | `RootLayout` | Public |
| `/app` | `GazaSummary` | `AppLayout` | Public |
| `/app/gaza` | `GazaSummary` | `AppLayout` | Public |
| `/app/westBank` | `WestBankSummary` | `AppLayout` | Public |
| `/app/gazaMap` | `MapContainer` | `AppLayout` | Public |
| `/submit` | `IncidentForm` | `RootLayout` | Public (Turnstile protected) |
| `/login` | `AdminLogin` | `RootLayout` | Public |
| `/admin/moderation`| `ModerationQueue` | `RootLayout` | Protected (JWT + RBAC `ADMIN` / `MODERATOR`) |