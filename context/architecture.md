# Architecture

## Stack

| Layer                          | Tool                                     | Purpose                                            |
| ------------------------------ | ---------------------------------------- | -------------------------------------------------- |
| Framework                      | React (Vite) / Next.js                   | Frontend UI & rendering                            |
| Backend Engine                 | Node.js (Express / Fastify)              | High-performance API server                        |
| Database & ORM                 | PostgreSQL + Prisma ORM                  | Data persistence & relational modeling             |
| Caching Layer                  | Redis + In-Memory TTL Cache              | High-throughput geo-data & stats caching           |
| Auth & Authorization           | JWT + HttpOnly Cookies + RBAC            | Secure authentication and permission control       |
| Validation                     | Zod                                      | Schema validation for API payloads & state         |
| UI / Styling                   | Tailwind CSS + Radix UI + Lucide Icons   | Accessible dark mode UI & icon system              |
| State Management               | TanStack Query + Zustand                 | Server state caching/polling & global UI state     |
| Logging & Monitoring           | Winston + Sentry                         | Standardized backend logging & error tracking      |
| Testing                        | Vitest + React Testing Library + Playwright | Unit, UI component, and end-to-end testing         |

---

## Folder Structure (Clean Architecture)

```
src/
├── core/                                → Shared business rules & domain models
│   ├── entities/                        → Core entity definitions (Incident, Statistic, User)
│   ├── use-cases/                       → Business logic handlers
│   └── errors/                          → Domain error classes
├── features/                            → Feature-driven modules
│   ├── map/                             → Interactive Gaza/West Bank map feature
│   │   ├── components/                  → Map controls, pin overlays, popups
│   │   ├── hooks/                       → Geo-data query & map state hooks
│   │   └── services/                    → GeoJSON & spatial API handlers
│   ├── statistics/                      → Humanitarian metrics & charts feature
│   │   ├── components/                  → Time-series charts, stat cards
│   │   └── hooks/                       → Data fetching & time-range state
│   ├── summary/                         → Incident details & evidence summaries
│   └── moderation/                      → Admin moderation dashboard feature
├── shared/                              → Cross-cutting utilities & primitives
│   ├── ui/                              → Reusable UI components (Button, Modal, Card)
│   ├── api/                             → Axios/Fetch client & query setup
│   └── utils/                           → Formatting, date, & spatial helpers
├── layouts/                             → Main App Layout, Navbar, Footer
└── pages/                               → Top-level route pages (Map, Stats, Admin, Submit)
```

---

## Data Flow & API Standard

### API Response Envelope

All API endpoints strictly follow the standardized response envelope:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2026-08-03T10:00:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired session token."
  },
  "timestamp": "2026-08-03T10:00:00.000Z"
}
```

---

## System Boundaries & Clean Architecture Rules

1. `src/core` must not import from UI components or framework-specific modules.
2. Feature modules (`src/features/*`) encapsulate their own components, state hooks, and API interactions.
3. Global UI state is managed via Zustand; server data fetching and polling use TanStack Query.
4. Database queries and ORM operations are isolated behind backend repository patterns.

