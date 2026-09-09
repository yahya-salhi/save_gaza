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
| `Button` | `shared/ui/Button.jsx` | Primary / ghost action (Radix Slot) | `--accent-500/600`, `--focus-ring`, `--radius-md`, `--text-on-accent`, `--surface-3` ghost hover |
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
| `GazaSummary` | `features/statistics/components/GazaSummary.jsx` | Statistics | Stat grid, 4 states, `StatItem` components |
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