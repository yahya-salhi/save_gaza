# Architecture

## Stack — Target (Greenfield Clean Start)

The repository currently contains only `AGENTS.md` and `context/` documentation. **Zero application code exists today.** Phase 1, Slice 0.1 & 1.1 will scaffold the project from scratch following Clean Architecture principles.

| Layer | Architecture Specification | Implementation Tool |
| ----- | -------------------------- | ------------------- |
| Frontend | React 18 SPA (Vite) — Strictly NO Next.js / SSR | React 18, Vite 5, JavaScript + JSDoc (`checkJs: true`) |
| Backend | Node.js Express REST API | Node.js 20+, Express 4/5, TypeScript (`tsc --noEmit`) |
| Database & ORM | Relational DB + ORM | PostgreSQL 16 (Docker) + Prisma ORM |
| Caching | In-memory TTL & Distributed Cache | Redis + in-memory stale-while-revalidate fallback |
| Auth & RBAC | Token Auth & Access Control | JWT (short-lived in-memory) + HttpOnly Refresh Cookie + RBAC |
| Validation | Runtime Contract Boundary Validation | Zod on both client inputs and server API endpoints |
| UI & Styling | Dark Observatory Token System | Tailwind CSS v3 + CSS Modules (`*.module.css`) + `App.css` tokens |
| Server State | Client Query & Cache Engine | TanStack Query v5 |
| Global UI State | Client Lightweight UI Store | Zustand v4/v5 (theme, sidebar drawer, active filters) |
| i18n / RTL | Bidirectional Localization | i18n layer, full Arabic RTL (`dir="rtl"`), LTR mono numerals |
| Logging | Structured Logging & Tracing | Winston with `x-request-id` correlation |
| Observability | Error Tracking & Telemetry | Sentry (frontend + backend) |
| Anti-bot | Automated Protection | Cloudflare Turnstile on public incident submissions |
| Testing | Unit, Integration, E2E | Vitest + React Testing Library (FE), Vitest + Supertest (BE), Playwright (E2E) |
| CI Pipeline | Automated Quality Gate | GitHub Actions: `lint` → `typecheck` → `test` → `build` |

---

## Monorepo Layout (Scaffold Target)

```
savegaza/
├── frontend/                          # React 18 + Vite SPA (JavaScript + JSDoc)
│   ├── src/
│   │   ├── core/                      # Pure client entities, DTOs & errors (no UI imports)
│   │   ├── features/                  # Feature slices (summary, statistics, map, moderation)
│   │   │   └── [feature]/
│   │   │       ├── __fixtures__/      # Colocated mock envelope payloads
│   │   │       ├── hooks/             # Feature TanStack Query hooks
│   │   │       └── components/        # Feature UI components (PascalCase.jsx + .module.css)
│   │   ├── layouts/                   # Page shells & layout nav (RootLayout, AppLayout, Navbar, Footer)
│   │   ├── pages/                     # Route-level page components
│   │   ├── shared/                    # Cross-cutting primitives & infrastructure
│   │   │   ├── api/                   # Envelope client (client.js)
│   │   │   ├── ui/                    # Reusable token primitives (Card, Button, StatItem, etc.)
│   │   │   └── providers/             # Global providers (ThemeProvider, I18nProvider)
│   │   ├── App.css                    # Canonical design tokens (:root)
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/                           # Express + Prisma API (TypeScript)
│   ├── src/
│   │   ├── core/                      # Pure domain layer (no framework imports)
│   │   │   ├── entities/              # Core business models (Summary, Statistic, Incident, User)
│   │   │   ├── errors/                # DomainError, NotFoundError, ExternalApiError, ValidationError
│   │   │   └── ports/                 # Abstract interfaces (IRepository, ITelemetryFeedPort, ICachePort)
│   │   ├── application/               # Application use cases & services
│   │   │   └── use-cases/             # Single-responsibility use cases
│   │   ├── infrastructure/            # Adapters for external systems & database
│   │   │   ├── database/              # Prisma client & database connection
│   │   │   ├── repositories/          # Prisma implementations of domain ports
│   │   │   ├── external/              # TechForPalestine v2 API adapter
│   │   │   └── cache/                 # Redis and in-memory TTL cache adapters
│   │   ├── controllers/               # Express HTTP controllers & routing (/api/v1/*)
│   │   ├── middlewares/               # Envelope formatter, error handler, Turnstile, RBAC, rate-limit
│   │   └── server.ts                  # Server setup & static SPA serving
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── tsconfig.json
├── package.json                       # Monorepo workspace root
└── AGENTS.md
```

---

## Production Data Boundary & Client Rules

1. **Production Proxy Mandate**:
   - In production (`import.meta.env.PROD`), all frontend data calls **MUST** go through the same-origin backend proxy via `VITE_API_BASE` (defaulting to `/api/v1`).
   - Direct external calls to `data.techforpalestine.org` are **strictly forbidden in production** and blocked by client logic and Content-Security-Policy.
   - Direct upstream fetching in `shared/api/client.js` is permitted **only** when `import.meta.env.DEV === true` AND `VITE_API_BASE` is explicitly empty for offline UI work.
   - CI runs a production build assertion verifying no direct external API URLs exist in `frontend/dist/`.

---

## Clean Architecture & System Boundaries

1. **Dependency Inversion**:
   - `backend/src/core` depends on nothing. Core defines domain entities, domain errors, and interfaces (ports).
   - Use cases (`application/use-cases/`) depend only on domain entities and ports.
   - Infrastructure adapters (`infrastructure/`) implement ports (e.g., Prisma repository implements `IStatisticRepository`).
   - Controllers (`controllers/`) orchestrate use cases and map HTTP requests/responses into the standardized envelope.
2. **Frontend Layering**:
   - Presentation components $\rightarrow$ Feature Query Hooks $\rightarrow$ API Client (`shared/api/client.js`).
   - Presentational UI components never parse raw API responses or construct HTTP headers directly.

---

## API Standard & Contract Catalog

### Standard JSON Response Envelope
All REST API endpoints output the standardized envelope:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2026-09-04T12:00:00.000Z"
}
```

Error format:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date range specified."
  },
  "timestamp": "2026-09-04T12:00:00.000Z"
}
```

### Documented Envelope Exception
- `GET /api/v1/statistics/export`: Sole documented binary/streaming exception. Returns `Content-Type: text/csv` or `application/json` as raw attachment (`Content-Disposition: attachment; filename="..."`).

### Upstream API Version
- Upstream data source is strictly pinned to TechForPalestine **v2**: `https://data.techforpalestine.org/api/v2/`.

### Versioned Endpoint Catalog
| Endpoint | Method | Role | Caching Policy |
| -------- | ------ | ---- | -------------- |
| `/api/v1/summary` | GET | Current verified casualty tally | Redis / Memory TTL (5 min, SWR) |
| `/api/v1/statistics/gaza` | GET | Gaza daily casualties & records | DB backed, cached (15 min) |
| `/api/v1/statistics/west-bank` | GET | West Bank daily telemetry | DB backed, cached (15 min) |
| `/api/v1/statistics/history` | GET | Range filtered casualty telemetry | DB indexed query |
| `/api/v1/statistics/export` | GET | Raw CSV/JSON researcher download | Streamed, no-cache |
| `/api/v1/spatial/boundaries` | GET | Gaza & West Bank GeoJSON polygons | Static GeoJSON, compressed, cached (24h) |
| `/api/v1/spatial/regions/:id` | GET | Regional casualty aggregates | In-memory spatial index |
| `/api/v1/incidents/pins` | GET | Verified incident map markers | Bounding box query, cached (10 min) |
| `/api/v1/incidents` | POST | Public incident report submission | Turnstile verified, rate-limited |
| `/api/v1/auth/login` | POST | Admin login | Rate-limited (5/15m), no-store |
| `/api/v1/auth/refresh` | POST | Rotate JWT access token | HttpOnly cookie, no-store |
| `/api/v1/auth/logout` | POST | Revoke session & clear cookie | no-store |
| `/api/v1/admin/incidents/pending` | GET | Unverified incident review queue | Protected (RBAC), no-store |
| `/api/v1/admin/incidents/:id/status`| PATCH | Approve or reject incident report | Protected (RBAC), audit log write |
| `/health` | GET | Service liveness probe | No auth |
| `/ready` | GET | Database & Redis readiness check | No auth |

---

## Observability, Security & Performance

- **Logging**: Winston with correlated `x-request-id` passed from frontend to backend.
- **Error Tracking**: Sentry on both frontend and backend.
- **Security Headers**: Helmet with Content-Security-Policy (CSP) allowing Google Fonts, OpenStreetMap tiles, Cloudflare Turnstile, and Sentry.
- **Authentication**: JWT access token (15m in-memory) + HttpOnly, SameSite=Strict, Secure refresh token cookie.
- **Social Sharing (SEO)**: Pre-rendered static HTML metadata in `index.html` + dynamic route tags for crawler link unfurling.