# Project Overview

## About the Project

Save Gaza is a world-class, professional web application dedicated to raising awareness, reporting real-time verified casualty statistics, and visualizing interactive maps (Gaza & West Bank) for human rights advocates, researchers, journalists, and the general public. Built with Clean Architecture, robust design patterns, high aesthetic quality (obsidian dark mode "Refined Observatory" UI design system), and secure token-based authentication.

---

## Greenfield Notice

**Zero application code exists in the repository today.** All architecture and features will be implemented starting in Phase 0 (Slice 0.1).

---

## The Problem It Solves

Advocates, journalists, and researchers currently face fragmented and delayed incident data, lack of interactive spatial maps, and poor visualization tools for tracking humanitarian metrics and crisis events in Gaza and the West Bank.

Save Gaza centralizes verified incident reports, spatial geo-data, humanitarian aid metrics, and real-time statistics into an accessible, resilient, and beautifully designed platform.

---

## Pages

```
/                  → Public Landing & Awareness Homepage (Instrument Hero)
/app               → Dashboard Shell & Gaza Overview
/app/gaza          → Gaza Verified Casualties & Metrics
/app/westBank      → West Bank Humanitarian Telemetry
/app/gazaMap       → Interactive Gaza & West Bank Map
/submit            → Community Incident & Data Submission Form
/login             → Admin Auth page (JWT & RBAC Login)
/admin/moderation  → Admin Incident & Report Moderation Dashboard
```

---

## Navigation

Top navbar with clear, high-contrast dark theme controls:

```
Map    Statistics    Submit Incident    Admin / Login
```

---

## Core User Flows

### Interactive Map & Telemetry
- Interactive spatial map of Gaza and the West Bank with custom markers (incidents, aid distribution, casualty zones).
- Filter markers by incident type, date range, and severity.
- Click incident marker to view verified source details, timestamps, and media evidence.

### Real-Time Statistics & Analytics
- Live casualty count, displaced population metrics, and casualty breakdown graphs.
- Dynamic time-series filtering and data visualizers powered by chart modules.
- Data export capabilities (JSON/CSV) for researchers.

### Community Incident Submission
- Form for community members to submit new incident reports with location coordinates, descriptions, and source links.
- Submissions enter an unverified queue awaiting admin review. Guarded by Cloudflare Turnstile anti-bot.

### Admin & Moderation Dashboard
- Authenticated login via JWT + HttpOnly cookies with RBAC.
- Admin dashboard to review, approve, reject, or request edits on submitted incident reports.

---

## Technical Stack & Architecture

- **Frontend**: React 18 + Vite SPA (Strictly NO Next.js / SSR), JavaScript + JSDoc (`checkJs: true`), Tailwind CSS with dark mode tokens (`App.css`), Lucide Icons + FontAwesome stat icons, Radix UI accessible primitives.
- **State Management**: TanStack Query for server state/caching/polling + Zustand for global UI state.
- **Backend Architecture**: Node.js (Express), TypeScript, Prisma ORM, PostgreSQL database (Docker), Redis & in-memory TTL cache, TechForPalestine v2 proxy.
- **API & Security**: RESTful API (`/api/v1/`), standardized response envelope (`{ success, data, error, timestamp }`), Zod schema validation on both boundaries, JWT auth with HttpOnly cookies & RBAC, Winston & Sentry error handling/observability.

---

## In Scope

- Interactive map with filterable incident pins and popups.
- Real-time humanitarian stats and interactive charts.
- Verified incident submission and admin moderation workflow.
- Clean Architecture layout (`core/`, `application/`, `infrastructure/`, `controllers/`).
- Internationalization readiness (i18n: English, Arabic with full RTL layout).

---

## Out of Scope

- E-commerce or merchandise sales.
- Direct non-advocacy social networking or arbitrary user messaging.