# Memory — Ticket 01 Project & Clean Architecture Foundation

Last updated: 2026-08-03

## What was built

- Clean Architecture skeleton with `.gitkeep`: `save_Gaza/src/core/{entities,use-cases,errors}`, `src/features/{map,statistics,summary,moderation}`, `src/shared/{ui,api,utils,providers}`, `src/layouts`.
- Tailwind CSS 3.4.19 design system: `save_Gaza/tailwind.config.js` (`darkMode: "class"`, palette mapped from `App.css` tokens), `postcss.config.js`, `src/index.css` (`@tailwind base/components/utilities`).
- Radix UI primitives: `@radix-ui/react-slot` (shared `src/shared/ui/Button.jsx`) + `@radix-ui/react-dialog` (Navbar mobile menu).
- `src/shared/providers/ThemeProvider.jsx` (+ test): class-based dark/light, persists under localStorage `sg-theme`, toggles `dark` / `light-theme` on `<html>`.
- Base layout: `src/layouts/RootLayout.jsx` (Navbar + Outlet + Footer), `Navbar.jsx` (sticky header, theme toggle, Radix Dialog mobile menu), `Footer.jsx`, shared `navItems.js` (`NAV_ITEMS`: Map `/app/gazaMap`, Statistics `/app/gaza`, Submit Incident `/submit`, Admin `/login`).
- Vitest + React Testing Library setup: test block in `vite.config.js` (jsdom, globals, `src/test/setup.js`), `test` / `test:watch` scripts. 14 tests green (ThemeProvider 6, Navbar 5, Footer 3).
- Wiring: `main.jsx` wraps `ThemeProvider` + imports `index.css`; `App.jsx` renders public routes inside `RootLayout` (dashboard `/app` untouched, stays on `AppLayout`); deleted `src/components/PageNav.jsx` + `.module.css`.
- Docs updated to match: `AGENTS.md` + `context/{code-standards,ui-tokens,ui-rules,library-docs,ui-registry,progress-tracker}.md` now declare Tailwind + Radix + Vitest as approved stack; Ticket 01 marked complete.
- Committed as `7bf2c64` on branch `feature/clean-architecture-foundation` (43 files, 3502+/301-). Working tree clean.

## Decisions made

- Tailwind + Radix override the old "no Tailwind" rule (user-approved, Ticket 01). Docs were updated to resolve the conflict.
- Styling split: shared UI/layouts (`src/layouts`, `src/shared/*`) use Tailwind utilities; dashboard feature components keep CSS Modules + `App.css` tokens. One palette mapped in both `App.css` `:root` and `tailwind.config.js`.
- Dark mode is class-based (`darkMode: "class"`); light theme is opt-in via `ThemeProvider` (default `dark`).
- Public routes wrapped in `RootLayout`; `/app/*` stays on `AppLayout` (no global footer there).
- Testing with Vitest + RTL (TDD on ThemeProvider/Navbar/Footer).

## Problems solved

- **Duplicate React / "Invalid hook call"**: `react-router-dom` was imported but missing from `save_Gaza/package.json` (root `node_modules` masked it). Fixed by installing `react-router-dom@^6.30.4` inside `save_Gaza`; react@18.3.1 deduped. Never add a react-router import without the dep in `save_Gaza/package.json`.
- Nested `<main>` landmarks (RootLayout + Homepages) fixed — Homepages now uses a `<div>`.
- Navbar/Footer `NAV_ITEMS` keyed `href` but consumed as `to` — renamed to `to`.

## Current state

- Ticket 01 done and committed. Branch: `feature/clean-architecture-foundation`.
- 14/14 tests pass, `npm run lint` 0 errors (5 pre-existing react-refresh/only-export-components warnings on context providers), production build passes.
- `/app` dashboard verified rendering correctly after Tailwind preflight (CSS Modules intact).
- **Known, out-of-scope issue**: homepage summary fetch is CORS-blocked on `https://data.techforpalestine.org/api/v3/summary.min.json` (SummaryContext shows "error loading Api data"). `SummaryContext` untouched — pre-existing, dashboard data (v2 `casualties_daily.json`) works.
- Light-theme restyle of the Tailwind shell is incomplete: theme toggle changes `<html>` classes + icon, but the shell colors are fixed dark (flagged in code review as follow-up).

## Next session starts with

- Ticket 02 — Database Schema, Prisma & Core Domain Entities (from `context/build-plan.md`): PostgreSQL + Prisma schemas (`Incident`, `Statistic`, `User`, `AuditLog`), core domain entities + error classes in `src/core/entities` + `src/core/errors`, Winston logging + API error envelope. Note: app is a client-only SPA — Prisma/Postgres implies a new backend layer; confirm scope before scaffolding.

## Open questions

- Whether Ticket 02's backend (Prisma/PostgreSQL/Winston) lives in this repo or a new workspace — needs confirmation before starting.
- Whether to fix the v3 summary CORS error (out of Ticket 01 scope).
