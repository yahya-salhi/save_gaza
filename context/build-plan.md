# Build Plan

## Core Principle

Tracer-bullet vertical slices cutting cleanly through Domain -> API -> UI -> Tests. Clean Architecture layout (`src/core`, `src/features/*`, `src/shared`, `src/layouts`, `src/pages`) with high-contrast dark mode aesthetics.

---

## Phase 1 — Project Setup & Shared Foundation

### Ticket 01 — Project & Clean Architecture Foundation
- Set up project directory structure (`src/core`, `src/features`, `src/shared`, `src/layouts`, `src/pages`).
- Configure Tailwind CSS design system with dark mode tokens (`ui-tokens.md`) and Radix UI primitives.
- Implement base layout (`Navbar`, `Footer`, Theme Provider) with high-aesthetic styling.

### Ticket 02 — Database Schema, Prisma & Core Domain Entities
- Configure PostgreSQL database & Prisma ORM schemas (`Incident`, `Statistic`, `User`, `AuditLog`).
- Define core Domain entities and Error classes in `src/core/entities` and `src/core/errors`.
- Set up Winston backend logging and standardized API error envelope middleware.

---

## Phase 2 — Interactive Telemetry & Map Feature

### Ticket 03 — Incident Telemetry Backend API & Caching
- Build RESTful `/api/v1/incidents` endpoint with query parameters (incident type, date range, severity).
- Implement Zod schema validation for input queries.
- Add Redis / in-memory TTL caching layer for high-throughput spatial data responses.

### Ticket 04 — Interactive Map Component & GeoJSON Telemetry UI
- Build `src/features/map` components (spatial map display for Gaza & West Bank with custom incident pins).
- Integrate TanStack Query hook for spatial data fetching and polling.
- Implement interactive popups for incident markers showing verified sources and timestamps.

---

## Phase 3 — Real-Time Humanitarian Statistics & Analytics

### Ticket 05 — Statistics Aggregation Backend API
- Create `/api/v1/statistics` endpoints for casualty counters, displaced population metrics, and aid delivery data.
- Include time-series breakdown endpoints supporting custom date ranges.

### Ticket 06 — Real-Time Statistics Dashboard UI & Charts
- Build `src/features/statistics` dashboard cards and time-series chart visualizers.
- Implement CSV/JSON export options for researchers and advocates.

---

## Phase 4 — Community Submissions & Moderation Workflow

### Ticket 07 — JWT Auth & RBAC Middleware
- Implement JWT authentication with HttpOnly secure cookies and refresh token rotation.
- Create RBAC middleware restricting access by user role (`Admin`, `Contributor`, `Public`).

### Ticket 08 — Community Incident Submission & Admin Moderation Workflow
- Build public incident submission form (`/submit`) with Zod payload validation.
- Build Admin Moderation Dashboard (`/admin/moderation`) allowing admins to review, approve, or reject submissions.
