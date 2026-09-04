# Save Gaza

A monorepo powering **Save Gaza** — a dark humanitarian data instrument for verified casualty statistics, interactive maps, and crisis telemetry for Gaza and the West Bank.

## Architecture

| Package | Stack | Path |
| ------- | ----- | ---- |
| Frontend | React 18 + Vite (JS/JSX, `checkJs: true`), Tailwind CSS + CSS Modules | `frontend/` |
| Backend | Node.js + Express, TypeScript, Prisma ORM + PostgreSQL | `backend/` |

The frontend is a **single-page app** (no Next.js / SSR). Routing is `react-router-dom` v6. In production, all frontend data flows through the same-origin backend proxy, which itself proxies the TechForPalestine v2 API (`https://data.techforpalestine.org/api/v2/`).

Full architecture, build plan, design tokens, and progress are documented under [`context/`](context/).

## Getting Started

```bash
npm install

# Run backend (http://localhost:PORT) and frontend dev server
npm run dev

# Or individually
npm run dev:backend
npm run dev:frontend
```

## Workspaces

- `frontend/` — React 18 + Vite SPA
- `backend/` — Express + Prisma API

## Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Run backend + frontend dev servers |
| `npm run build` | Build backend then frontend |
| `npm run lint` | Lint all workspaces |
| `npm run typecheck` | Typecheck all workspaces (`tsc --noEmit` + `checkJs`) |
| `npm run test` | Run all workspace tests |