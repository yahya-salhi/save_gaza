# Library Docs

Project-specific usage patterns for every third-party library in Save Gaza. Read the relevant section before implementing any feature that uses these libraries.

---

## Before Using Any Library

1. **Check `library-docs.md`** (this file) for project-specific patterns
2. **Check `ui-registry.md`** if the library affects UI (Recharts, Leaflet)
3. **Check `code-standards.md`** for general conventions

Never rely on training data alone — verify against installed versions in `save_Gaza/package.json`.

---

## React Router DOM

**Version:** v6 (bundled with react-router-dom)

### Setup

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Routes>
    <Route index element={<Homepages />} />
    <Route path="app" element={<AppLayout />}>
      <Route index element={<IndexSummary />} />
      <Route path="gaza" element={<GazaSummary />} />
    </Route>
  </Routes>
</BrowserRouter>
```

### Navigation

```jsx
import { NavLink, Link, useLocation, useSearchParams } from "react-router-dom";

// Active nav styling (Navbar)
<NavLink to="/app/gaza" className={({ isActive }) => isActive ? "text-brand-green" : "text-light-2 hover:text-brand-green"}>

// Stat card links (GazaSummary)
<Link to={`?details=${value}`} className={styles.statisticItem}>

// Query param detection (AppLayout)
const [searchParams] = useSearchParams();
const isDetailView = searchParams.has("details");
```

**Rules:**

- Use `<NavLink>` for sidebar/top nav with active states
- Use `<Link>` for stat cards linking to detail query params
- Nested routes render via `<Outlet />` or conditional rendering in AppLayout
- Never use `<a href>` for internal navigation

---

## React Context

Three providers wrap the app:

```jsx
// main.jsx — ThemeProvider wraps the whole tree
<ThemeProvider>
  <App />
</ThemeProvider>

// App.jsx — data/UI providers inside the router tree
<SummaryProvider>
  <AppProvider>
    <BrowserRouter>...</BrowserRouter>
  </AppProvider>
</SummaryProvider>
```

### ThemeProvider (`src/shared/providers/ThemeProvider.jsx`)

Class-based dark mode for the whole app.

```jsx
import { useTheme } from "../shared/providers/ThemeProvider";

const { theme, toggleTheme } = useTheme();
// theme: "dark" | "light"
```

- Toggles `dark` / `light-theme` class on `document.documentElement` (pair with `darkMode: "class"` in `tailwind.config.js`)
- Persists under localStorage key `sg-theme`; default `dark`
- Throws if `useTheme` used outside the provider

### AppContext

Dashboard UI state — sidebar, loading, error, time-series data, selected date.

```jsx
import { useAppContext, ActionTypes } from "../context/AppContext";

const { state, dispatch } = useAppContext();
dispatch({ type: ActionTypes.TOGGLE_SIDEBAR });
dispatch({ type: ActionTypes.SET_DATA, payload: fetchedData });
dispatch({ type: ActionTypes.SET_SELECTED_DATE, payload: date });
```

### SummaryContext

Aggregated summary statistics for Gaza and West Bank.

```jsx
import { useSummary } from "../context/SummaryContext";

const { gaza, westBank, isLoading } = useSummary();
```

**Rules:**

- Always consume context via custom hooks (`useAppContext`, `useSummary`)
- Never create new Context providers without documenting in this file
- Fetch side effects belong in layout/page components, not deep presentational components

---

## Leaflet + React-Leaflet

**Versions:** leaflet ^1.9.4, react-leaflet ^4.2.1

### Map Component Pattern

```jsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

<MapContainer center={[31.5, 34.45]} zoom={11} className={styles.map}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <GeoJSON data={geoJsonData} />
</MapContainer>
```

### CSS Module Overrides

Leaflet injects its own class names — override with `:global()`:

```css
/* GazaMap.module.css */
:global(.leaflet-popup .leaflet-popup-content-wrapper) {
  background-color: var(--color-dark--1);
  color: var(--color-light--2);
  border-radius: 5px;
}

:global(.leaflet-popup-content-wrapper) {
  border-left: 5px solid var(--color-brand--2);
}
```

**Rules:**

- Always import `leaflet/dist/leaflet.css` in the map component
- Map container needs explicit height (600px in GazaMap)
- Use `:global()` for Leaflet popup/tooltip styling — CSS Modules won't scope them otherwise
- Fix Leaflet default marker icon paths if using default markers (known Vite issue)
- Region polygons use `RegionPolygon` wrapper with opacity hover transition

---

## Recharts

**Version:** ^2.13.2

### Line Chart (ChartLine)

```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

<div className={styles.chartContainer}>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={filteredData}>
      <XAxis dataKey="report_date" tick={{ className: styles.chartLabel }} />
      <YAxis tick={{ className: styles.chartLabel }} />
      <Tooltip />
      <Line type="monotone" dataKey="killed" stroke="var(--color-brand--2)" />
    </LineChart>
  </ResponsiveContainer>
</div>
```

### Pie Chart (PieChart)

Uses Recharts `PieChart`, `Pie`, `Cell` for circular percentage displays.

**Rules:**

- Wrap charts in `ResponsiveContainer` inside a fixed-height card (450px for line, 200px+ for pie)
- Use CSS Module classes for axis label styling via `tick={{ className: styles.chartLabel }}`
- Stroke/fill colors should reference CSS variables where possible
- Filter data by `selectedDate` from AppContext before passing to charts
- Chart container follows card token pattern from `ui-tokens.md`

---

## React Icons

**Version:** ^5.3.0 (Font Awesome subset)

### Stat Card Icons

```jsx
import { FaChild, FaHeartBroken, FaUserMd, FaFemale } from "react-icons/fa";

<Icon className={styles.icon} />
```

Used in: GazaSummary, WestBankSummary

| Icon | Stat |
| ---- | ---- |
| FaHeartBroken | Total Killed |
| FaChild | Children Killed |
| FaFemale | Women Killed |
| FaUserMd | Medical Staff Killed |
| FaUserShield | Massacres / Civil Defense |
| FaNewspaper | Press Killed |
| FaAmbulance | Total Injured |

**Rules:**

- Icon color via CSS Module: `color: var(--color-brand--2)`
- Icon size: 2.4rem in GazaSummary, 4rem in WestBankSummary
- Pass icon component as prop: `icon: FaChild`, render as `<Icon className={styles.icon} />`

---

## Lucide React

**Version:** ^0.454.0

UI chrome icons only — not stat categories.

```jsx
import { Menu, X } from "lucide-react";

<button aria-label="Open sidebar">
  <Menu size={24} />
</button>
```

Used in: AppLayout (sidebar toggle, close button)

**Rules:**

- Use `size={24}` for header buttons
- Always pair icon-only buttons with `aria-label`
- Do not mix Lucide and react-icons in the same stat card

---

## React Slider

**Version:** ^2.0.6

Used in RangeSlider for date selection. The current implementation uses a native `<input type="range">` with custom CSS in `RangeSlider.module.css` rather than the react-slider component directly.

If switching to react-slider:

```jsx
import ReactSlider from "react-slider";

<ReactSlider
  min={0}
  max={data.length - 1}
  value={currentIndex}
  onChange={handleChange}
  className={styles.slider}
  thumbClassName={styles.thumb}
  trackClassName={styles.track}
/>
```

**Rules:**

- Slider thumb: green (`--color-brand--2`), hover crimson
- Track: dark (`--color-dark--2`)
- Display selected date above slider in subtitle-sized text
- Sync selected index with AppContext `selectedDate`

---

## Tailwind CSS

**Version:** ^3.4.19 (approved via Ticket 01 — shared UI/layouts only)

### Config

`save_Gaza/tailwind.config.js` maps the `App.css` token palette to Tailwind color names. Dark mode is class-based — `ThemeProvider` toggles the `dark` class.

```js
darkMode: "class",
colors: {
  "background-dark": "#121212",
  card: "#1c1c1e",
  brand: { crimson: "#c41e3a", green: "#2ecc71" },
  dark: { 0: "#242a2e", 1: "#2d3439", 2: "#42484d" },
  light: { 1: "#aaa", 2: "#ececec", 3: "#d6dee0" },
}
```

### Usage

```jsx
<header className="sticky top-0 z-40 border-b border-white/5 bg-background-dark/95 backdrop-blur">
  <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    ...
  </nav>
</header>
```

**Rules:**

- Only shared UI/layouts (`src/layouts`, `src/shared/ui`, `src/shared/providers`) use Tailwind — dashboard feature components keep CSS Modules
- Use the mapped palette classes (`bg-card`, `text-light-2`, `text-brand-green`…) — never arbitrary hex in `[#hex]` classes
- `border-white/5`, `bg-black/60`, `bg-black/80` opacity utilities are fine for overlays/borders
- Preflight is enabled (`src/index.css` has `@tailwind base`) — verify dashboard feature modules still render correctly after new global base styles

---

## Radix UI

**Versions:** @radix-ui/react-slot ^1.3.3, @radix-ui/react-dialog ^1.1.23

### Slot (Button)

```jsx
// src/shared/ui/Button.jsx — asChild merges className onto the child element
<Button asChild><NavLink to="/app/gaza">Map</NavLink></Button>
```

### Dialog (Navbar mobile menu)

```jsx
<Dialog.Root>
  <Dialog.Trigger asChild>...</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
    <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-card p-6 shadow-xl">
      <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
      ...
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**Rules:**

- `Dialog.Trigger` / `Dialog.Close` must use `asChild` when wrapping a `<Button>` so the button renders as the actual DOM node
- `Dialog.Title` is required for a11y — use `sr-only` when invisible
- Always provide `aria-label` on icon-only buttons

---

## Vitest + Testing Library

**Versions:** vitest ^2.1.9, jsdom ^29.1.1, @testing-library/react ^16.3.2, @testing-library/jest-dom ^7.0.0, @testing-library/user-event ^14.6.1

### Setup

- Test block in `vite.config.js`: `environment: "jsdom"`, `globals: true`, `setupFiles: "./src/test/setup.js"` (imports jest-dom)
- Run: `npm run test` (single run) / `npm run test:watch`

### Example

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("toggles theme", async () => {
  const user = userEvent.setup();
  render(<Navbar />);
  await user.click(screen.getByRole("button", { name: /switch to light/i }));
  expect(document.documentElement).toHaveClass("light-theme");
});
```

**Rules:**

- Colocate tests as `ComponentName.test.jsx` next to the component
- Use `@testing-library/jest-dom` matchers (`toHaveClass`, `toBeInTheDocument`)
- Components that need routing (Navbar, Footer) render inside `MemoryRouter`
- LocalStorage/jsdom globals — reset between tests when persisting state

---

## TechForPalestine API

External data source — no API key required.

### Endpoints

| Region | URL |
| ------ | --- |
| Gaza daily casualties | `https://data.techforpalestine.org/api/v2/casualties_daily.json` |
| West Bank daily | `https://data.techforpalestine.org/api/v2/west_bank_daily.min.json` |

### Response Shape (Gaza)

```json
{
  "report_date": "2026-08-03",
  "massacres": 0,
  "killed": {
    "total": 0,
    "children": 0,
    "women": 0,
    "civil_defence": 0,
    "press": 0,
    "medical": 0
  },
  "injured": {
    "total": 0
  }
}
```

**Rules:**

- Always check `res.ok` before parsing
- Data is an array of daily records — use the last entry for current totals
- Filter by `report_date` for time-series charts and slider
- Never cache stale data indefinitely — refetch on route change
- Handle missing nested fields (`gaza.killed`, `gaza.injured`) before rendering

---

## JSON Server (Dev Only)

**Version:** ^1.0.0-beta.3

Local mock server for development:

```bash
npm run server
# json-server --watch data/gaza.json --port 8000 --delay 500
```

**Rules:**

- Dev only — production uses TechForPalestine API directly
- 500ms delay simulates network latency
- Do not commit sensitive mock data

---

## Vite

**Version:** ^5.4.9

### Config

Standard React plugin setup. Static assets in `public/` (e.g., `/image5.jpg` for homepage hero).

**Rules:**

- Run dev with `npm run dev`
- Environment variables use `import.meta.env.VITE_*` prefix (when added)
- CSS Modules work out of the box with `.module.css` extension
- Leaflet marker icon fix may be needed — check Vite + Leaflet docs if markers break

---

## ESLint

**Version:** ^9.13.0

```bash
npm run lint
```

Current config allows `/* eslint-disable react/prop-types */` in JSX files without PropTypes.

**Rules:**

- Run lint before committing
- Fix lint errors — do not disable rules without reason
- PropTypes are optional in current codebase (JSX, not TSX)
