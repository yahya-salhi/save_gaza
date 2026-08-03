# UI Registry

Living document for **Save Gaza**. Updated to reflect the current component library. Read this before building any new component — match existing CSS Module patterns and tokens from `ui-tokens.md` exactly.

---

## How to Use

Before building any component:

1. Check if a similar component already exists below
2. If yes — match its exact module classes and token usage
3. If no — build following `ui-rules.md` and `ui-tokens.md`, then add an entry here

After building any component — update this file with the component name, file path, and key classes.

---

## Global Styles

**File:** `save_Gaza/src/App.css`

| Class / Token | Purpose |
| ------------- | ------- |
| `:root` variables | All design tokens (colors, typography, radius) |
| `.card` | Generic dark card surface |
| `.cta` / `.cta:link` | Primary uppercase CTA button |
| `.red` | `--color-brand--1` text utility |
| `.green` | `--color-brand--2` text utility |
| `.bloody-text` | Landing hero animated crimson headline |
| `h1`, `h2`, `p` | Global type defaults |
| `input`, `textarea` | Form field styling |

---

## Layout

### AppLayout

**File:** `save_Gaza/src/pages/AppLayout.jsx` + `AppLayout.module.css`

Main dashboard shell — header, collapsible sidebar, main content area.

| Class | Purpose |
| ----- | ------- |
| `.app` | Full-height flex column, `--bg-color` background |
| `.header` | Top bar: Logo, title, Learn More, menu toggle |
| `.content` | Flex row: sidebar + main |
| `.sidebar` | Fixed overlay panel, `--sidebar-width`, slide animation |
| `.sidebarOpen` | `left: 0` — visible state |
| `.sidebarActive .main` | Main content offset when sidebar open |
| `.main` | Scrollable content area with map/charts |
| `.map` | Map/chart wrapper, 12px radius, shadow |
| `.learnMoreBtn`, `.menuBtn` | Header action buttons |
| `.closeSidebarBtn` | X button inside sidebar |
| `.red`, `.green` | "War" / "in Gaza" title color split |

### Homepages

**File:** `save_Gaza/src/pages/Homepages.jsx` + `Homepages.module.css`

Public landing page with hero, video, statistics callout.

| Class | Purpose |
| ----- | ------- |
| `.homepage` | Full hero with background image + gradient |
| `.homeContainer` | Overlapping card with video section |
| `.title` | Section heading |
| `.videoSection`, `.video`, `.playButton` | Embedded video with play overlay |
| `.statisticsSection` | Dark translucent stats panel |
| `.statisticsText`, `.note` | Stat copy and disclaimer |
| `.cta` | Green primary link button |

---

## Navigation

### AppNav

**File:** `save_Gaza/src/components/AppNav.jsx` + `AppNav.module.css`

Sidebar route navigation (Gaza, West Bank, Gaza Map).

| Class | Purpose |
| ----- | ------- |
| `.nav` | Dark container, `--color-dark--2` bg |
| `.nav ul` | Vertical stack → horizontal on ≥768px |
| `.nav a` | Uppercase links, light text |
| `.nav a:hover` | Green background, lift |
| `.nav a.active` | Crimson background (active route) |

### Logo

**File:** `save_Gaza/src/components/Logo.jsx` + `Logo.module.css`

| Class | Purpose |
| ----- | ------- |
| `.navbarLogo` | Flex row: image + text |
| `.navbarLogo img` | 40px max-height, white glow drop-shadow |
| `.logoText` | 16px bold white, hover crimson tint |

---

## Shared Shell (Tailwind)

Ticket 01 base layout. Styled with Tailwind utilities (palette mapped in `tailwind.config.js`) — no module files. All live under `save_Gaza/src/layouts` / `save_Gaza/src/shared`.

### Navbar

**File:** `save_Gaza/src/layouts/Navbar.jsx`

Sticky top nav for public routes. Sticky, backdrop-blur, dark translucent bg.

| Element | Classes / behavior |
| ------- | ------------------ |
| `.header` | `sticky top-0 z-40 border-b border-white/5 bg-background-dark/95 backdrop-blur` |
| Nav container | `mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8` |
| Desktop links | `hidden md:flex`, uppercase `text-light-2`, active/hover `text-brand-green` |
| Theme toggle | `Button` rounded-full, Sun (dark) / Moon (light), `aria-label` "Switch to light theme" / "Switch to dark theme" |
| Mobile menu | Radix Dialog slide-over, `bg-card`, `w-72`, hidden `md:hidden` trigger |
| Nav items | From `src/layouts/navItems.js` — Map `/app/gazaMap`, Statistics `/app/gaza`, Submit Incident `/submit`, Admin `/login` |

### Footer

**File:** `save_Gaza/src/layouts/Footer.jsx`

| Element | Classes / behavior |
| ------- | ------------------ |
| Root | `border-t border-white/5 bg-background-dark` |
| Container | `mx-auto flex max-w-7xl flex-col md:flex-row items-center md:items-start justify-between gap-6 px-4 py-10` |
| Brand | "Save Gaza" bold `text-light-2`, tagline `text-light-1` |
| Links | Same `NAV_ITEMS`, uppercase, `hover:text-brand-green` |
| Copyright | `© {year} Save Gaza` |

### ThemeProvider

**File:** `save_Gaza/src/shared/providers/ThemeProvider.jsx`

Not visual — class-based theme context. Wraps `App` in `main.jsx`.

| Item | Value |
| ---- | ----- |
| Storage key | `sg-theme` (`"dark"` default / `"light"`) |
| DOM effect | toggles `dark` and `light-theme` classes on `<html>` |
| Hook | `useTheme()` → `{ theme, toggleTheme }` |

### Button

**File:** `save_Gaza/src/shared/ui/Button.jsx`

Radix Slot button primitive — renders a `<button>` or merges props into child with `asChild`.

| Item | Value |
| ---- | ----- |
| Base classes | `inline-flex items-center justify-center rounded-[10px] px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green disabled:opacity-50` |
| Props | `asChild`, `className` (appended to base), rest spread |

---

## Statistics & Summaries

### GazaSummary

**File:** `save_Gaza/src/components/GazaSummary.jsx` + `GazaSummary.module.css`

Grid of clickable casualty stat cards for Gaza. Data from `SummaryContext`.

| Class | Purpose |
| ----- | ------- |
| `.container` | Card wrapper, `--color-card-bg` |
| `.statisticsGrid` | Auto-fit grid, minmax(280px, 1fr) |
| `.statisticItem` | Dark nested card, flex row, hover lift |
| `.icon` | Green react-icons, 2.4rem |
| `.statisticContent` | Value + label column |
| `.statisticValue` | 2.4rem, weight 800 |
| `.statisticLabel` | 1.6rem body text |
| `.loading`, `.error` | Centered state messages |

### WestBankSummary

**File:** `save_Gaza/src/components/WestBankSummary.jsx` + `WestBankSummary.module.css`

Same stat card pattern as GazaSummary for West Bank data.

| Class | Purpose |
| ----- | ------- |
| `.statisticsContainer` | Semi-transparent panel, 350px width |
| `.statisticItem` | Flex row card with hover highlight |
| `.icon` | 4rem icons |
| `.statisticValue` | 2rem bold |
| `.statisticLabel` | 2rem secondary |

### IndexSummary

**File:** `save_Gaza/src/components/IndexSummary.jsx`

Default `/app` route — composes summary components. No dedicated CSS module.

### DetailsSummary

**File:** `save_Gaza/src/components/DetailsSummary.jsx` + `DetailsSummary.module.css`

Detail view triggered by `?details=` query param.

| Class | Purpose |
| ----- | ------- |
| `.container` | Card with padding |
| `.title` | Subtitle size, green bottom border |
| `.content` | Body text, line-height 1.6 |
| `.content mark` | Green highlight on key values |
| `.error` | Crimson centered error |

### Statistics

**File:** `save_Gaza/src/components/Statistics.jsx` + `Statistics.module.css`

Compact stat panel with hover-elevated cards.

| Class | Purpose |
| ----- | ------- |
| `.statisticsContainer` | Card wrapper |
| `.statisticsTitle` | Centered section heading |
| `.infoPanel` | Auto-fit grid, minmax(150px) |
| `.stat` | Centered stat card, hover translateY(-5px) |
| `.stat h2` | Label, 1.4rem |
| `.stat p` | Value, 2rem bold green |

---

## Charts

### ChartLine

**File:** `save_Gaza/src/components/ChartLine.jsx` + `ChartLine.module.css`

Recharts line chart for daily casualty time series.

| Class | Purpose |
| ----- | ------- |
| `.chartContainer` | 450px card container |
| `.chartTitle` | Centered subtitle heading |
| `.chartLabel` | SVG axis label fill |
| `.totalKilled` | Absolute badge, top-right, green on dark |

### PieChart

**File:** `save_Gaza/src/components/PieChart.jsx` + `PieChart.module.css`

Recharts circular percentage charts with dashboard footer.

| Class | Purpose |
| ----- | ------- |
| `.container` | Card wrapper, min-height 200px |
| `.title` | Centered heading |
| `.chartsContainer` | Flex wrap chart row |
| `.circleWrapper`, `.circle` | 200px SVG ring |
| `.percentageText` | Centered percentage overlay |
| `.labelText` | Category label below percentage |
| `.dashboard` | Bottom summary bar, `--color-dark--1` |

---

## Maps

### Map

**File:** `save_Gaza/src/components/Map.jsx` + `Map.module.css`

Gaza/West Bank choropleth-style map with pie chart and legend.

| Class | Purpose |
| ----- | ------- |
| `.mapContainer` | Max-width 1200px wrapper |
| `.pieChartContainer` | Nested chart card |
| `.mapTitle`, `.mapDescription` | Centered headings |
| `.legendContainer`, `.legendItem`, `.legendColor` | Color legend row |
| `.tooltip` | Dark tooltip popup |
| `.loading`, `.error` | State messages |

### GazaMap

**File:** `save_Gaza/src/components/GazaMap/Components/GazaMap.jsx` + `GazaMap.module.css`

Leaflet interactive map with region polygons and info panel.

| Class | Purpose |
| ----- | ------- |
| `.container` | Grid: map + 400px info panel |
| `.mapContainer` | 600px height, rounded, shadowed |
| `.map` | Full-size Leaflet mount |
| `:global(.leaflet-popup *)` | Dark popup overrides |

### RegionInfo

**File:** `save_Gaza/src/components/GazaMap/Components/RegionInfo/RegionInfo.jsx` + `RegionInfo.module.css`

**Status:** Dark token spec defined — code still uses light theme. Apply spec below when implementing.

Reference pattern: `DetailsSummary` (green title border, dark card surface).

| Class | Purpose | Target tokens |
| ----- | ------- | ------------- |
| `.regionInfo` | Side panel card beside GazaMap | `background: var(--color-card-bg)`, `padding: 2rem`, `border-radius: var(--border-radius)`, `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` |
| `.title` | Region name or empty-state heading | `font-size: var(--font-size-subtitle)`, `color: var(--color-light--1)`, `border-bottom: 2px solid var(--color-brand--2)`, `padding-bottom: 1rem`, `margin-bottom: 1.5rem` |
| `.subTitle` | "Additional Information" section heading | Same as `.title` but `font-size: var(--font-size-text)`, `font-weight: 600`, `margin-top: 1.5rem` |
| `.infoGrid` | Label/value grid | `display: grid`, `gap: 1.6rem` |
| `.infoItem` | Single field row | `display: grid`, `gap: 0.4rem` |
| `.label` | Field label | `font-size: 1.4rem`, `color: var(--color-light--1)`, `font-weight: 500` |
| `.value` | Field value / list items | `font-size: var(--font-size-text)`, `color: var(--color-light--2)`, `line-height: 1.6` |
| `.colorIndicator` | Region map color bar | `height: 8px`, `border-radius: 4px`, `margin-top: 1.6rem` — `background-color` stays inline from GeoJSON `color` prop |
| Empty state `<p>` | "Click on a region…" | `color: var(--color-light--2)`, `font-size: var(--font-size-text)`, centered or left-aligned |

**Remove from implementation:** `white`, `#333`, `#666`, `#eee` — no hardcoded hex.

**Note:** `.subTitle` is referenced in `RegionInfo.jsx` but has no matching rule in the current CSS module (renders unstyled today) — add it per the table above. The empty-state `<p>` ("Click on a region…") currently has no `className`; add one in JSX for it to receive the tokens above.

### RegionTooltip

**File:** `save_Gaza/src/components/GazaMap/Components/RegionTooltip/RegionTooltip.jsx` + `RegionTooltip.module.css`

**Status:** Dark token spec defined — code still uses light theme. Apply spec below when implementing.

Reference pattern: Leaflet popup overrides in `GazaMap.module.css` (dark surface, green left accent).

| Class | Purpose | Target tokens |
| ----- | ------- | ------------- |
| `.tooltip` | Floating hover tooltip on map regions | `background: var(--color-dark--1)`, `color: var(--color-light--2)`, `padding: 1.2rem`, `border-radius: var(--border-radius)`, `border-left: 5px solid var(--color-brand--2)`, `box-shadow: 0 4px 12px rgba(0,0,0,0.25)`, `max-width: 300px` |
| `.title` | Region name | `font-size: var(--font-size-text)`, `font-weight: 600`, `color: var(--color-light--1)`, `margin-bottom: 0.8rem` |
| `.info` | Stat line (population, area, etc.) | `font-size: 1.4rem`, `color: var(--color-light--2)`, `line-height: 1.4`, `margin: 0.4rem 0` |
| `.label` | Inline label within stat line | `color: var(--color-light--1)`, `font-weight: 600` |

**Remove from implementation:** `rgba(255,255,255,0.95)`, `#333`, `#666`, system font stack — use `var(--font-family-main)`.

**Note:** RegionTooltip is a React component rendered inside Leaflet — visual language must match `:global(.leaflet-popup *)` overrides in GazaMap.

### RegionPolygon

**File:** `save_Gaza/src/components/GazaMap/Components/RegionPolygon/RegionPolygon.jsx` + `RegionPolygon.module.css`

| Class | Purpose |
| ----- | ------- |
| `.polygon` | Opacity transition on hover |

### HeaderMap

**File:** `save_Gaza/src/components/HeaderMap.jsx` + `HeaderMap.module.css`

**Status:** Dark token spec defined — JSX currently uses unstyled markup + global `.green` class; module CSS exists but is not imported. Wire up module when implementing.

Map section header above the main chart/map content in AppLayout.

| Class | Purpose | Target tokens |
| ----- | ------- | ------------- |
| `.header` | Context bar above map/chart | `padding: 1.5rem 0`, `margin-bottom: 1.5rem`, `text-align: center`, no background (inherits `--bg-color` from AppLayout) — **not** white |
| `.title` | Primary heading (`h2`) | `font-size: var(--font-size-subtitle)`, `font-weight: 700`, `color: var(--color-light--1)`, `margin-bottom: 0.5rem` |
| `.accent` | "Daily casualties" highlight span | `color: var(--color-brand--2)` — replaces global `.green` |
| `.subtitle` | Date/region context (`p`) | `font-size: var(--font-size-text)`, `color: var(--color-light--2)` |
| `.location` | Region name (gaza / westbank) | `color: var(--color-brand--1)`, `font-weight: 600`, `text-transform: capitalize` |
| `.separator` | Pipe or divider between meta items | `color: var(--color-dark--2)`, optional — only if splitting multiple meta fields |

**JSX changes when implementing:**

- Import `styles from "./HeaderMap.module.css"`
- Wrap in `<div className={styles.header}>`
- Replace `<span className="green">` with `<span className={styles.accent}>`
- Wrap region name in `<span className={styles.location}>`

**Remove from implementation:** `background: white`, `#e2e8f0` (`.header` border-bottom), `#1e293b`, `#64748b`, `#ef4444`, `#22c55e`, `#94a3b8` — all map to tokens above.

---

## Controls

### RangeSlider

**File:** `save_Gaza/src/components/RangeSlider.jsx` + `RangeSlider.module.css`

Date range selector for time-series filtering.

| Class | Purpose |
| ----- | ------- |
| `.container` | Card wrapper |
| `.dateDisplay` | Centered current date, subtitle size |
| `.slider` | Custom range input, dark track |
| `.slider::-webkit-slider-thumb` | Green circle thumb |
| `.tickMarks`, `.tick`, `.activeTick` | Date tick indicators |

### Buttons

**File:** `save_Gaza/src/components/Buttons.jsx` + `Buttons.module.css`

| Class | Purpose |
| ----- | ------- |
| `.btn` | Base button, uppercase, radius |
| `.primary` | Green bg, dark text |
| `.back` | Outlined ghost button |
| `.position` | Absolute centered floating CTA |

### ToggleButton

**File:** `save_Gaza/src/components/ToggleButton.jsx` + `ToggleButton.module.css`

Fixed top-right theme toggle (uses global class names, not CSS Modules).

| Class | Purpose |
| ----- | ------- |
| `.toggle-button` | Fixed top-right, transparent bg |

---

## Feedback

### Spinner

**File:** `save_Gaza/src/components/Spinner.jsx` + `Spinner.module.css`

| Class | Purpose |
| ----- | ------- |
| `.spinnerContainer` | Full-height centered flex |
| `.spinner` | Conic-gradient rotating ring |

### Message

**File:** `save_Gaza/src/components/Message.jsx` + `Message.module.css`

| Class | Purpose |
| ----- | ------- |
| `.message` | Centered 1.8rem bold text, 80% width |

---

## Sidebar Shell

### Sidebar

**File:** `save_Gaza/src/components/Sidebar.jsx` + `Sidebar.module.css`

Composes AppNav, summaries, RangeSlider, and footer.

| Class | Purpose |
| ----- | ------- |
| `.sidebar` | 56rem flex column, `--color-dark--1` bg |
| `.content` | Scrollable inner stack, custom green scrollbar |
| `.summaryWrapper` | Summary component container |
| `.footer`, `.copyright` | Bottom copyright bar |

---

## Dark Token Migration — Map Sub-Components

Spec-only (documented in context, not yet applied in source). When implementing, follow this order:

| Step | Component | Files to touch | Reference component |
| ---- | --------- | -------------- | ------------------- |
| 1 | HeaderMap | `HeaderMap.jsx`, `HeaderMap.module.css` | DetailsSummary `.title` border |
| 2 | RegionInfo | `RegionInfo.module.css` | DetailsSummary `.container` |
| 3 | RegionTooltip | `RegionTooltip.module.css` | GazaMap `:global(.leaflet-popup *)` |

**Invariant after migration:** All three components use only `var(--color-*)` tokens — zero hardcoded hex. Visual check: panel beside map (`RegionInfo`) should match sidebar card depth (`--color-card-bg`); tooltip should match Leaflet popup styling.

---

## Route → Component Map

| Route | Primary UI |
| ----- | ---------- |
| `/` | Homepages (inside RootLayout shell) |
| `/page1`, `/page2` | Page1 / Page2 (inside RootLayout shell) |
| `/submit`, `/login` | Planned (Ticket 08) — currently resolve to PageNotFound |
| `/app` | IndexSummary (via Sidebar) |
| `/app/gaza` | Map + GazaSummary in Sidebar |
| `/app/westBank` | Map + WestBankSummary in Sidebar |
| `/app/gazaMap` | GazaMap |
| `/app/gaza?details=N` | DetailsSummary |

`RootLayout` (Navbar + Footer) wraps all public routes; `/app/*` uses the `AppLayout` dashboard shell (no global footer).

---

## Data Sources (UI Context)

| Component | API |
| --------- | --- |
| GazaSummary, Map (Gaza) | `https://data.techforpalestine.org/api/v2/casualties_daily.json` |
| WestBankSummary, Map (WB) | `https://data.techforpalestine.org/api/v2/west_bank_daily.min.json` |
| SummaryContext | Aggregated summary stats |
| AppContext | Sidebar state, date selection, fetch lifecycle |
