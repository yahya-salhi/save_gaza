# Code Standards

Implementation rules for Save Gaza. Follow these in every session to prevent pattern drift.

---

## Greenfield Clean-Start Invariant

**Zero application code exists in the repository today.** All files and folders described below represent the target architecture to be scaffolded starting in Phase 0 (Slice 0.1). Do not attempt to import from or migrate non-existent legacy providers or components.

---

## Stack & Language Boundary

| Layer | Language / Tool | Rules |
| ----- | --------------- | ----- |
| Frontend | React 18 + Vite (JavaScript / JSX) | Strict JSDoc typing (`jsconfig.json` with `checkJs: true`). ESLint 9. No TypeScript in `frontend/`. Strictly NO Next.js / SSR. |
| Backend | Node.js Express (TypeScript) | Strict TypeScript (`tsconfig.json` with `tsc --noEmit`). Prisma ORM + PostgreSQL. |
| Routing | react-router-dom v6 | `BrowserRouter`, routes under `/` and `/app/*` |
| Styling | Tailwind CSS v3 + CSS Modules | Shared UI & layouts use Tailwind; dashboard features use CSS Modules (`*.module.css`) referencing `App.css` tokens |
| Server State | TanStack Query v5 | Wrapped in custom feature hooks (`features/[feature]/hooks/`) |
| UI State | Zustand v4/v5 | Lightweight stores in `features/` or `shared/` (e.g., sidebar drawer, active filters) |
| Validation | Zod | Runtime contract validation on both client inputs and server API boundaries |
| Maps | Leaflet + react-leaflet | Gaza and West Bank governorate telemetry |
| Charts | Recharts | Line and pie charts lazy-loaded via `React.lazy()` |
| Icons | `react-icons/fa` + `lucide-react` | FontAwesome for humanitarian casualty categories; Lucide for UI chrome |
| API Client | `shared/api/client.js` | Envelope-aware client unwrapping `{ success, data, error, timestamp }` |

---

## Monorepo Target Layout

### Structure under `frontend/src/`:

```
frontend/src/
├── core/                → Client domain types & DTO definitions (pure JS + JSDoc)
├── features/            → Feature modules (summary, statistics, map, moderation)
│   └── [feature]/
│       ├── __fixtures__/→ Colocated mock envelope payloads (loading, empty, error, populated)
│       ├── hooks/       → TanStack Query hooks (e.g., useGazaDaily.js, useSummary.js)
│       └── components/  → Feature UI components (PascalCase.jsx + .module.css)
├── layouts/             → Page shells & global nav (RootLayout, AppLayout, Navbar, Footer)
├── pages/               → Route-level page entry points
├── shared/              → Cross-cutting utilities & primitives
│   ├── api/             → Envelope client (client.js)
│   ├── ui/              → Reusable token primitives (Card, Button, StatItem, Skeleton, etc.)
│   ├── providers/       → Global providers (ThemeProvider, I18nProvider, QueryProvider)
│   └── test/            → Vitest setup & test utils
├── App.css              → Canonical design tokens (:root)
└── App.jsx              → Providers & Route definitions
```

### Structure under `backend/src/`:

```
backend/src/
├── core/                → Pure domain layer (no framework imports)
│   ├── entities/        → Domain entities (Summary, Statistic, Incident, User, AuditLog)
│   ├── errors/          → DomainError, NotFoundError, ExternalApiError, ValidationError
│   └── ports/           → Interfaces for repositories, cache, and external feeds
├── application/         → Application use cases
│   └── use-cases/       → Single-responsibility business logic (e.g., GetSummaryUseCase)
├── infrastructure/      → Adapters for external dependencies
│   ├── database/        → Prisma client
│   ├── repositories/    → Prisma repository implementations of domain ports
│   ├── external/        → TechForPalestine v2 API adapter
│   └── cache/           → Redis and in-memory TTL cache adapters
├── controllers/         → Express route handlers formatting standard envelope
├── middlewares/         → Envelope formatter, error handler, Turnstile, RBAC, rate-limit
└── server.ts            → Express app configuration & static fallback serving
```

- Component files: **PascalCase** — `GazaSummary.jsx`, `GazaSummary.module.css`
- Store files: **camelCase** — `useUiStore.js`
- Page files: **PascalCase** — `AppLayout.jsx`, `HomePage.jsx`
- Provider files: **PascalCase** — `ThemeProvider.jsx` in `shared/providers/` (NEVER `src/context/`)
- CSS Modules: same name as component — `ComponentName.module.css`
- Shared layout files: **PascalCase** — `Navbar.jsx`, `Footer.jsx`
- Test files: colocated `ComponentName.test.jsx` / `useCase.test.ts`

---

## Component Construction Rules

Standard component export pattern:

```jsx
import { useMemo } from "react";
import { FaChild } from "react-icons/fa";
import styles from "./GazaSummary.module.css";
import { useGazaDaily } from "../hooks/useGazaDaily";
import Card from "../../../shared/ui/Card";
import Skeleton from "../../../shared/ui/Skeleton";
import ErrorState from "../../../shared/ui/ErrorState";
import EmptyState from "../../../shared/ui/EmptyState";

export default function GazaSummary() {
  const { data, isLoading, isError, refetch } = useGazaDaily();

  if (isLoading) return <Skeleton count={4} />;
  if (isError) return <ErrorState message="Casualty records temporarily unavailable" onRetry={refetch} />;
  if (!data || data.length === 0) return <EmptyState message="No casualty records available" />;

  return (
    <Card className={styles.container}>
      {/* Populated content */}
    </Card>
  );
}
```

Order within a component file:
1. External library imports (`react`, `lucide-react`, `react-icons`)
2. Internal shared primitives & hooks
3. CSS Modules import (`styles`)
4. Sub-components (if private to this file)
5. Main component function (`export default function ComponentName`)

---

## Styling & Token Rules

- Feature styles in **CSS Modules**; shared layouts in Tailwind. Both consume `App.css` tokens.
- Reference tokens: `var(--accent-500)`, `var(--surface-1)`, `var(--text-1)`, `--space-*`, `--radius-*`, `--elevation-*` — never raw hex (`#fff`, `#000`), raw rem spacing, or custom shadows.
- Layout must be **direction-agnostic**: use logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline-*`, `border-inline-*`). Physical `left` / `right` are prohibited.
- Numerals and timestamps must maintain LTR reading order: `<span dir="ltr" className="font-mono tabular-nums inline-block [unicode-bidi:isolate]">`.
- Verified status indicator is strictly an **8px green dot (`bg-verified`)** beside neutral text. Never render full green buttons or badges.

---

## Data Fetching & API Standard

The frontend calls the backend proxy via `shared/api/client.js`. In production, all calls route to same-origin `/api/v1`. Direct external calls are forbidden.

```js
import { apiGet } from "../../../shared/api/client";

// Canonical catalog endpoint
export async function fetchGazaDaily() {
  return await apiGet("/statistics/gaza");
}
```

Canonical Catalog Endpoints:
- Summary: `/summary`
- Statistics: `/statistics/gaza`, `/statistics/west-bank`, `/statistics/history`
- Export: `/statistics/export` (sole streaming raw exception)
- Spatial: `/spatial/boundaries`, `/spatial/regions/:id`, `/incidents/pins`
- Submissions: `/incidents`
- Auth: `/auth/login`, `/auth/refresh`, `/auth/logout`
- Admin: `/admin/incidents/pending`, `/admin/incidents/:id/status`

---

## Error Handling Standards

- Domain errors are typed subclasses of `DomainError` in `backend/src/core/errors/`.
- The global Express error middleware catches errors and formats them into `{ code, message }` inside the envelope.
- The client-side envelope client unwraps `data` on HTTP 200, or throws a normalized `{ message, code }` error on failure.
- UI components render user-friendly, human-readable error messages with retry buttons via `ErrorState`. Never display raw JSON error bodies.