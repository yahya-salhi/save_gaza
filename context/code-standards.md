# Code Standards

Implementation rules for Save Gaza. Follow these in every session to prevent pattern drift.

---

## Engineering Mindset

- **Read context files first** — verify against `architecture.md`, `project-overview.md`, and `ui-registry.md`
- **Scope is sacred** — only build what the current feature requires
- **Match existing patterns** — CSS Modules, Context API, default exports (current codebase convention)
- **Clean over clever** — readable code preferred over abstractions
- **One thing at a time** — complete one feature before starting the next

---

## Stack (Current)

| Layer | Tool | Notes |
| ----- | ---- | ----- |
| Framework | React 18 + Vite | SPA, not Next.js (yet) |
| Routing | react-router-dom v6 | BrowserRouter, nested routes under `/app` |
| Styling | Tailwind CSS + CSS Modules + App.css tokens | Tailwind for shared UI/layouts; CSS Modules for dashboard features |
| UI primitives | @radix-ui/react-slot, @radix-ui/react-dialog | Accessible `Button` (Slot), Navbar mobile menu |
| Testing | Vitest + React Testing Library | `npm run test`, jsdom, `src/test/setup.js` |
| Maps | Leaflet + react-leaflet | GazaMap feature |
| Charts | Recharts | ChartLine, PieChart |
| Icons | react-icons/fa + lucide-react | Stat icons vs UI chrome |
| State | React Context | `AppContext`, `SummaryContext`, `ThemeProvider` |
| Data | TechForPalestine API | External JSON endpoints |
| Lint | ESLint 9 | `npm run lint` |

Target stack (future phases) is documented in `architecture.md` — do not introduce Next.js or Prisma without an explicit migration ticket. Tailwind + Radix are approved (Ticket 01).

---

## File and Folder Naming

Current structure under `save_Gaza/src/`:

```
src/
├── components/          → Dashboard UI components (PascalCase.jsx + .module.css)
├── context/             → React Context providers (AppContext, SummaryContext)
├── core/                → Clean Architecture core layer (entities/, use-cases/, errors/) — .gitkeep until Ticket 02
├── features/            → Feature modules (map/, statistics/, summary/, moderation/) — .gitkeep until later phases
├── layouts/             → Page shells + base layout (RootLayout, Navbar, Footer, navItems)
├── pages/               → Route-level page components
├── shared/              → Cross-feature code (ui/, api/, utils/, providers/)
│   ├── ui/              → Reusable primitives (Button)
│   ├── providers/       → Global providers (ThemeProvider)
│   └── test/            → Vitest setup (setup.js)
└── App.jsx              → Router setup
```

- Component files: **PascalCase** — `GazaSummary.jsx`, `GazaSummary.module.css`
- Context files: **PascalCase** — `AppContext.jsx`
- Page files: **PascalCase** — `AppLayout.jsx`, `Homepages.jsx`
- CSS Modules: same name as component — `ComponentName.module.css`
- Shared layout files: **PascalCase** — `Navbar.jsx`, `Footer.jsx` (Tailwind utilities, no module file)
- Test files: colocated `ComponentName.test.jsx`
- One component per file (small sub-components like `StatisticItem` are acceptable inline)

---

## Component Structure

Current codebase uses default exports:

```jsx
/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { FaChild } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./GazaSummary.module.css";
import { useSummary } from "../context/SummaryContext";

function StatisticItem({ icon: Icon, value, label, to }) {
  // ...
}

function GazaSummary() {
  const { gaza, isLoading } = useSummary();
  // derived data via useMemo
  // loading / error / render states
  return (/* JSX */);
}

export default GazaSummary;
```

Order within a component file:

1. External imports
2. Internal imports (context, sibling components, styles)
3. Sub-components (if small and not reused elsewhere)
4. Main component
5. Default export

---

## Styling Rules

- All component styles in **CSS Modules** — import as `styles`
- Reference global tokens: `var(--color-brand--2)`, never hardcoded hex
- Global utilities only in `App.css` (`.card`, `.cta`, `.red`, `.green`)
- Leaflet overrides use `:global()` in the module file
- Responsive breakpoints: 480px, 768px, 1024px
- See `ui-rules.md` for full patterns

---

## State Management

### AppContext (`save_Gaza/src/context/AppContext.jsx`)

Manages dashboard state: sidebar toggle, loading, error, fetched data, selected date.

```jsx
const { state, dispatch } = useAppContext();
dispatch({ type: ActionTypes.SET_SELECTED_DATE, payload: date });
```

### SummaryContext (`save_Gaza/src/context/SummaryContext.jsx`)

Provides aggregated Gaza/West Bank summary statistics.

```jsx
const { gaza, westBank, isLoading } = useSummary();
```

Rules:

- Fetch in layout/page effects, not in presentational components when possible
- Always handle loading, error, and empty data states in UI
- Never mutate context state directly — always dispatch

---

## Data Fetching

External API (no backend yet):

```jsx
const res = await fetch(
  "https://data.techforpalestine.org/api/v2/casualties_daily.json"
);
if (!res.ok) throw new Error("Network response was not ok");
const data = await res.json();
```

Rules:

- Always check `res.ok` before parsing
- Wrap in try/catch with user-friendly error messages
- Set loading state before fetch, clear in `finally`
- Never expose raw error objects to the UI

---

## Routing

Defined in `App.jsx`:

```jsx
<Route path="app" element={<AppLayout />}>
  <Route index element={<IndexSummary />} />
  <Route path="gaza" element={<GazaSummary />} />
  <Route path="gaza/:param" element={<DetailsSummary />} />
  <Route path="westBank" element={<WestBankSummary />} />
  <Route path="gazaMap" element={<GazaMap />} />
</Route>
```

- Use `<NavLink>` for navigation with active states
- Query params (`?details=`) for detail views — check with `useSearchParams()`
- Use `<Link>` for stat card navigation to detail views

---

## Error Handling

- Never use empty catch blocks — always log with context
- Console errors include prefix: `console.error("Fetch error:", err)`
- User-facing errors: human-readable strings, not API response bodies
- Error UI uses `.error` class with `--color-brand--1` color

---

## Comments

- No comments explaining what code does — code should be self-explanatory
- Comments only for non-obvious decisions (e.g., why `:global()` is needed for Leaflet)
- Never leave TODO comments in committed code

---

## Dependencies

Approved dependencies (see `save_Gaza/package.json`):

- `react`, `react-dom` — UI framework
- `react-router-dom` — client routing
- `leaflet`, `react-leaflet` — interactive maps
- `recharts` — charts
- `react-icons` — stat category icons
- `lucide-react` — UI icons (menu, close)
- `react-slider` — range slider
- `tailwindcss` + `postcss` + `autoprefixer` — utility-first styling (Ticket 01)
- `@radix-ui/react-slot`, `@radix-ui/react-dialog` — accessible UI primitives
- `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` — unit tests
- `json-server` — local dev mock server

Do not install new packages without updating this list and `library-docs.md`.

---

## Scripts

```bash
npm run dev          # Vite dev server
npm run build        # Production build
npm run lint         # ESLint
npm run preview      # Preview production build
npm run server       # json-server mock (port 8000)
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
```

---

## Import Conventions

Current codebase uses relative imports:

```jsx
import GazaSummary from "./components/GazaSummary";
import { useSummary } from "../context/SummaryContext";
```

When the project migrates to Clean Architecture (`src/features/*`), switch to path aliases — until then, match existing relative import depth.
