---
description: Instructions for building the Save Gaza React + Vite dashboard
globs: *
alwaysApply: true
---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This project is a **React 18 + Vite single-page app** — there is no Next.js, no SSR, and no app/pages router. Ignore Next.js conventions from your training data. Routing is `react-router-dom` v6, styling is Tailwind CSS (shared UI/layouts) + CSS Modules with `App.css` tokens (dashboard features), and data comes from the external TechForPalestine API. Read `context/architecture.md` and `context/library-docs.md` before writing any code.

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

## Rules That Never Change

- Never hardcode hex values in JSX or CSS Modules — always use `var(--color-*)` tokens from `App.css`
- Update `progress-tracker.md` and `ui-registry.md` after every feature
- Before any third party library — load its installed skill first,
  then read `context/library-docs.md` for project-specific rules
- If the same problem persists after one corrective prompt —
  stop immediately and run /recover

## Available Skills

- `/architect` — before any complex feature. Think before building.
- `/imprint` — after any new UI component. Capture patterns.
- `/review` — before demo or when something feels off.
- `/recover` — when something breaks after one failed correction.
- `/remember save` — when a feature spans multiple sessions.
- `/remember restore` — when returning after a multi-session feature.

# Data Layer & Integrations - Overview

## What powers this app?

Save Gaza is a **client-only React 18 + Vite SPA** — there is no custom backend in this repo. Capabilities are provided by:

- **Data**: TechForPalestine public JSON API (Gaza & West Bank daily records) — no API key, no auth
- **Routing**: react-router-dom v6 — `BrowserRouter`, nested routes under `/app`
- **State**: React Context — `AppContext` (dashboard UI state) + `SummaryContext` (aggregated stats)
- **Maps**: Leaflet + react-leaflet with GeoJSON region polygons
- **Charts**: Recharts (line + pie)
- **Icons**: react-icons/fa (stat categories) + lucide-react (UI chrome)
- **Dev mock**: json-server over `data/gaza.json` (development only)

## Installation

The following is a step-by-step guide to running and extending the Save Gaza front end. This is a plain React + Vite SPA — there is no SDK to install or backend to provision.

- The app, `package.json`, and all source live under `save_Gaza/`.
- Data comes from the external TechForPalestine API — no keys required.
- A local json-server mock is available for development only.

### 🚨 CRITICAL: Follow these steps in order

### Step 1: Open the project

Work inside `save_Gaza/`. Do not scaffold a new project — extend the existing Vite app.

### Step 2: Install dependencies

```bash
cd save_Gaza
npm install
```

### Step 3: Run the app

Start the dev server (and, if needed, the local mock) and verify before writing features:

```bash
npm run dev        # Vite dev server
npm run server     # json-server mock (data/gaza.json, port 8000) — dev only
npm run build      # production build
npm run lint       # ESLint 9
```

**DATA BASE URL**: Live data is fetched from `https://data.techforpalestine.org/api/v2/`.

## Getting Detailed Documentation

### 🚨 CRITICAL: Always Read Context Docs Before Writing Code

The `context/` folder is the source of truth for how this project is built. Read the relevant file before touching related code.

- [Design tokens](context/ui-tokens.md) - colors, typography, spacing
- [UI rules & registry](context/ui-registry.md) - component patterns to match
- [Library docs](context/library-docs.md) - per-library usage patterns
- [Code standards](context/code-standards.md) - conventions & file layout

Before writing or editing any feature code, you **MUST** read the matching `context/*` file and verify library APIs against the installed versions in `save_Gaza/package.json`. This ensures you follow existing, accurate patterns.

### Read the project context docs for feature specifics:

Available context docs:

- `context/project-overview.md` - product scope and pages (START HERE)
- `context/architecture.md` - stack and folder structure
- `context/ui-tokens.md` - design tokens (never hardcode hex)
- `context/ui-rules.md` - component construction rules
- `context/ui-registry.md` - existing components to match
- `context/library-docs.md` - third-party library patterns
- `context/code-standards.md` - naming, structure, styling rules
- `context/build-plan.md` - planned work
- `context/progress-tracker.md` - what is done

These docs describe the current React + Vite implementation. For anything not covered, verify against installed versions before coding.

### Verify library usage against installed versions

`context/library-docs.md` documents project-specific patterns for each library used.

Libraries in use:

- `react-router-dom` - v6 routing, NavLink/Link, query params
- `react-leaflet` + `leaflet` - map container, GeoJSON, `:global()` popup overrides
- `recharts` - line/pie charts inside ResponsiveContainer
- `react-icons` - stat category icons (Font Awesome subset)
- `lucide-react` - UI chrome icons only
- `react-slider` - date range selection
- `tailwindcss` - v3 utility classes; design tokens mapped in `tailwind.config.js`
- `@radix-ui/react-slot`, `@radix-ui/react-dialog` - accessible UI primitives
- `vitest` + `@testing-library/react` - unit tests (`npm run test`, `npm run test:watch`)

Data source:

- TechForPalestine API - Gaza & West Bank daily JSON (no key)
- json-server - local dev mock only

Everything is JavaScript (JSX). PropTypes are optional in the current codebase.

## When to Use the Live API vs the Mock Server

### Always the TechForPalestine API for real data:

- Gaza daily casualties — `https://data.techforpalestine.org/api/v2/casualties_daily.json`
- West Bank daily — `https://data.techforpalestine.org/api/v2/west_bank_daily.min.json`
- Fetch with the `fetch` API in layout/page components, not deep presentational components
- Dispatch results into `AppContext` / `SummaryContext`
- Always check `res.ok`; data is an array of daily records — use the last entry for current totals
- Filter by `report_date` for time-series charts and the range slider

### Use json-server (dev only) for local mocking:

- `npm run server` serves `data/gaza.json` on port 8000 with a 500ms delay
- Dev only — production reads the TechForPalestine API directly
- Do not commit sensitive mock data
- Static assets (e.g. homepage hero) live in `save_Gaza/public/`

## Important Notes

- No vendor SDK — talk to data via the browser `fetch` API and handle `res.ok`/errors explicitly
- Handle missing nested fields (`gaza.killed`, `gaza.injured`) before rendering
- Consume Context only via custom hooks (`useAppContext`, `useSummary`)
- Style shared UI/layouts with Tailwind utilities; dashboard features keep CSS Modules (`*.module.css`); global utilities live in `App.css` (`.card`, `.cta`, `.red`, `.green`)
- Leaflet popups/tooltips need `:global()` overrides — CSS Modules won't scope them otherwise
- Use `<NavLink>` / `<Link>` for internal navigation — never `<a href>`
- **EXTRA IMPORTANT**: Styling is Tailwind + CSS Modules + `App.css` tokens — Tailwind was approved via Ticket 01 for shared UI/layouts; dashboard feature components keep CSS Modules. Never hardcode raw hex — use `var(--color-*)` tokens from `App.css` or the mapped palette in `tailwind.config.js`. Do not change React (18) or Vite (5) versions in `package.json` without a migration ticket

<!-- INSFORGE:START -->
## Data & Tooling

This project has **no hosted backend**: it is a static React + Vite front end that reads public humanitarian data directly from the [TechForPalestine](https://data.techforpalestine.org) API. Reach for the `context/*` docs and the installed skills before implementing any feature instead of guessing.

- **Project:** **Save Gaza** (data base `https://data.techforpalestine.org/api/v2/`)
- **Skills:** these skills are available for supported coding agents. Reach for them before building instead of guessing:
  - `/architect`: plan before any complex feature.
  - `/imprint`: capture UI patterns after building a new component.
  - `/review`: sanity-check before a demo or when something feels off.
  - `/recover`: when something breaks after one failed correction.
  - `find-skills`: discovering additional skills on demand.
- **Config:** dev scripts live in `save_Gaza/package.json`; runtime env vars (when added) use the `VITE_*` prefix via `import.meta.env`. Never hardcode or commit secrets.

Key patterns:

- Data is an array of daily records — use the last entry for current totals.
- Consume Context via `useAppContext` / `useSummary`; dispatch fetch results into `AppContext`.
- For Leaflet popups/tooltips, style with `:global()` overrides in the map CSS Module.
<!-- INSFORGE:END -->
