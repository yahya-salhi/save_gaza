# Progress Tracker

Update this file after every completed ticket. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 1 — Project Setup & Shared Foundation  
**Last completed:** Ticket 01 — Project & Clean Architecture Foundation  
**Next:** Ticket 02 — Database Schema, Prisma & Core Domain Entities  

---

## Progress

### Phase 1 — Project Setup & Shared Foundation

- [x] 01 Project & Clean Architecture Foundation
- [ ] 02 Database Schema, Prisma & Core Domain Entities

### Phase 2 — Interactive Telemetry & Map Feature

- [ ] 03 Incident Telemetry Backend API & Caching
- [ ] 04 Interactive Map Component & GeoJSON Telemetry UI

### Phase 3 — Real-Time Humanitarian Statistics & Analytics

- [ ] 05 Statistics Aggregation Backend API
- [ ] 06 Real-Time Statistics Dashboard UI & Charts

### Phase 4 — Community Submissions & Moderation Workflow

- [ ] 07 JWT Auth & RBAC Middleware
- [ ] 08 Community Incident Submission & Admin Moderation Workflow

---

## Decisions Made During Build

- **Tailwind + Radix approved (Ticket 01):** the shared design system now uses Tailwind CSS 3 (`darkMode: "class"`) + Radix UI primitives. Overrides the earlier "no Tailwind" rule in AGENTS.md / ui-rules.md — those docs updated to match.
- **Styling split:** shared UI + layouts (`src/layouts`, `src/shared/ui`, `src/shared/providers`) use Tailwind utilities; existing dashboard feature components (`src/components`, map/stat features) keep CSS Modules + `App.css` tokens. Token palette mapped into `tailwind.config.js` (background-dark, card, brand-crimson, brand-green, dark-0..2, light-1..3) so the two systems share one palette.
- **Theme toggle:** class-based dark mode. `ThemeProvider` toggles `dark` / `light-theme` on `<html>`, persists under localStorage key `sg-theme` (default `dark`).
- **Testing:** Vitest + React Testing Library + jsdom. Test setup in `src/test/setup.js`; run with `npm run test` (watch: `npm run test:watch`). TDD used for ThemeProvider, Navbar, Footer.
- **Public shell:** `RootLayout` (Navbar + Footer) now wraps public routes; `AppLayout` remains the `/app` dashboard shell. Old `PageNav` removed — `NAV_ITEMS` shared from `src/layouts/navItems.js`.
- **Dependency fix:** `react-router-dom` was imported but missing from `save_Gaza/package.json` (root `node_modules` masked it) causing duplicate React / "Invalid hook call". Fixed by installing `react-router-dom@^6.30.4` in `save_Gaza`.

## Notes

- Clean Architecture layout enforced under `src/core`, `src/features/*`, `src/shared`, `src/layouts`, `src/pages`.
- `src/core` and `src/features/*` scaffolded with `.gitkeep` — filled in from Ticket 02 onward.
- Full suite: 3 test files, 14 tests green. Lint 0 errors. Production build passes.

