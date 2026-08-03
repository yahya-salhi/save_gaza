# Progress Tracker

Update this file after every completed ticket. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** UI Redesign — "Verified Tally as an Instrument"  
**Last completed:** Instrument redesign (homepage hero + `/app` shell + shared shell accents)  
**Next:** Commit the redesign; `/imprint` pattern capture if new components were built; `/review` before demo

---

## Progress

### Phase 1 — Project Setup & Shared Foundation

- [x] 01 Project & Clean Architecture Foundation

### Phase 5 — UI Redesign: Verified Tally as an Instrument

- [x] Instrument hero (homepage) — figure opens the page, mono crimson tally, ticker, hairline rule
- [x] `/app` shell — `WAR IN GAZA` display 900 header, semantic tokens, HeaderMap dark panel
- [x] Data voice — mono 500 tabular-nums stat figures across dashboard
- [x] Crimson-only accent — green demoted to focus rings / verified status; token cascade (`--color-brand--2` → `#e0556b`)
- [x] Docs sync — `ui-tokens.md`, `ui-rules.md`, `ui-registry.md`, `library-docs.md`, `code-standards.md`, `progress-tracker.md`
- [ ] Commit the redesign

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
- **Styling split:** shared UI + layouts (`src/layouts`, `src/shared/ui`, `src/shared/providers`) use Tailwind utilities; existing dashboard feature components (`src/components`, map/stat features) keep CSS Modules + `App.css` tokens. Token palette mapped into `tailwind.config.js` (background-dark, card, brand-crimson, verified, dark-0..2, light-1..3) so the two systems share one palette.
- **Theme toggle:** class-based dark mode. `ThemeProvider` toggles `dark` / `light-theme` on `<html>`, persists under localStorage key `sg-theme` (default `dark`).
- **Testing:** Vitest + React Testing Library + jsdom. Test setup in `src/test/setup.js`; run with `npm run test` (watch: `npm run test:watch`). TDD used for ThemeProvider, Navbar, Footer.
- **Public shell:** `RootLayout` (Navbar + Footer) now wraps public routes; `AppLayout` remains the `/app` dashboard shell. Old `PageNav` removed — `NAV_ITEMS` shared from `src/layouts/navItems.js`.
- **Dependency fix:** `react-router-dom` was imported but missing from `save_Gaza/package.json` (root `node_modules` masked it) causing duplicate React / "Invalid hook call". Fixed by installing `react-router-dom@^6.30.4` in `save_Gaza`.
- **UI Redesign — Instrument direction:** homepage hero now opens with the documented figure itself (timestamped, mono, crimson) instead of a template slogan. Three-role type system added: Archivo 900 (display), IBM Plex Mono (data), Manrope (body).
- **Green → crimson cascade:** `--color-brand--2` redefined `#2ecc71` → `#e0556b` (light crimson) so every CSS Module using it updates via the cascade. Green preserved as `--color-verified` for focus rings / verified status dots only. `brand-green` removed from Tailwind config → `verified`.
- **Removed decorative animation:** the dripping `bloody-text` animation deleted from `App.css`; `.bloody-text` kept as static mono crimson. New signature motion is the homepage live-ticker pulse (disabled under `prefers-reduced-motion`).
- **AppLayout cleanup:** the leaking local `:root` (forced `Inter` + green `#4caf50`) removed from `AppLayout.module.css` — now semantic tokens only.
- **Live v3 feed note:** a live v3 fetch returned real totals (killed 73,375 / injured 174,220 / West Bank 1,107) in the dev browser, but strict CORS can still apply in production — the dashboard keeps v2 `casualties_daily.json`, and the homepage shows "—" with a retry notice when the feed is unreachable.

