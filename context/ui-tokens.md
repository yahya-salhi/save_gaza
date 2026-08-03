# UI Tokens

Design tokens for **Save Gaza** — a dark humanitarian dashboard for verified casualty statistics, interactive maps, and crisis telemetry. All tokens live in `save_Gaza/src/App.css` (`:root`) and are consumed via CSS Modules using `var(--token-name)`.

---

## Design Direction

| Axis | Choice |
| ---- | ------ |
| Subject | Humanitarian crisis data — Gaza & West Bank casualty tracking |
| Audience | Advocates, researchers, journalists, general public |
| Aesthetic | Dark observatory — data as testimony, not decoration |
| Signature | Red/green duality (`War` / `in Gaza`) — destruction vs. resilience; green icons on layered dark stat cards |

**Palette intent:** Obsidian backgrounds keep focus on numbers. Crimson (`--color-brand--1`) marks loss and errors. Survival green (`--color-brand--2`) marks life metrics and interactive affordances. Never introduce a third accent color.

---

## How to Use

Two systems share the same palette (Ticket 01):

1. **Tailwind CSS** — for shared UI + layouts (`src/layouts`, `src/shared/ui`, `src/shared/providers`). Palette mapped in `save_Gaza/tailwind.config.js`: `background-dark`, `card`, `brand-crimson`, `brand-green`, `dark-0..2`, `light-1..3`. Dark mode is class-based (`darkMode: "class"` — `ThemeProvider` toggles `dark` on `<html>`).
2. **CSS Modules + global CSS variables** — for dashboard feature components (maps, stats, charts), matching existing patterns.

```jsx
// Tailwind (shared UI) — colors map to the tokens below
<div className="bg-card text-light-2">...</div>

// CSS Module referencing global token (dashboard features)
import styles from "./GazaSummary.module.css";
<div className={styles.statisticItem} />

// In the .module.css file:
.statisticItem {
  background-color: var(--color-dark--1);
  color: var(--color-light--2);
}

// Never — hardcoded hex in component files
<div style={{ color: "#2ecc71" }} />

// Never — raw color names unrelated to tokens
color: green;
```

When adding a new token, define it once in `App.css` `:root` **and** add the matching entry in `tailwind.config.js`, then reference it everywhere else.

---

## Color Tokens

Defined in `save_Gaza/src/App.css`:

```css
:root {
  /* Surfaces */
  --color-background-dark: #121212;
  --color-card-bg: #1c1c1e;
  --color-dark--0: #242a2e;
  --color-dark--1: #2d3439;
  --color-dark--2: #42484d;

  /* Text */
  --color-light--1: #aaa;
  --color-light--2: #ececec;
  --color-light--3: #d6dee0;

  /* Brand — crimson (loss) & green (life/resilience) */
  --color-brand--1: #c41e3a;
  --color-brand--2: #2ecc71;

  /* Layout (AppLayout.module.css) */
  --bg-color: #121212;
  --header-bg-color: #1e1e1e;
  --btn-bg-color: #2c2c2c;
  --hover-bg-color: #3a3a3a;
  --text-color: #ffffff;
  --subtext-color: #b3b3b3;
  --accent-color: #4caf50;
  --sidebar-width: 450px;
}
```

### Semantic Usage

| Role | Token | Usage |
| ---- | ----- | ----- |
| Page background | `--color-background-dark` | `body`, map containers |
| Card surface | `--color-card-bg` | Summary panels, charts, sliders |
| Nested item surface | `--color-dark--1` | Stat cards, chart overlays, popups |
| Elevated hover | `--color-dark--0` | Stat card hover state |
| Muted surface | `--color-dark--2` | Nav bar, slider track, scrollbar track |
| Primary text (muted) | `--color-light--1` | Headings, stat values, titles |
| Primary text (bright) | `--color-light--2` | Body copy, labels, nav links |
| Input background | `--color-light--3` | Form inputs (global) |
| Loss / error / active nav | `--color-brand--1` | Errors, `.red`, active nav, hover on green |
| Life / icon / CTA | `--color-brand--2` | Icons, CTAs, chart highlights, scrollbar thumb |
| Header bar | `--header-bg-color` | App layout header, sidebar |

### Light Theme Override (optional)

```css
.light-theme {
  --color-background: #f8f8f8;
  --color-text: #333;
  --color-card-bg: #fff;
}
```

Dark theme is the default and primary design target.

---

## Typography

Font: **Manrope** — imported in `App.css` from Google Fonts.

```css
--font-family-main: "Manrope", sans-serif;
--font-size-title: 4.8rem;    /* 48px at 62.5% root */
--font-size-subtitle: 2.4rem; /* 24px */
--font-size-text: 1.6rem;     /* 16px */
```

Root font-size is `62.5%` on `html` (1rem = 10px).

| Element | Size | Weight | Color | Context |
| ------- | ---- | ------ | ----- | ------- |
| Hero title (homepage) | 4.5rem | 800 | `--color-light--1` | Landing |
| App header "War in Gaza" | inherit h1 | 800 | red/green split | AppLayout |
| Section title | `--font-size-subtitle` | 600–800 | `--color-light--1` | Cards, charts |
| Stat number | `--font-size-subtitle` | 800 | `--color-light--1` | GazaSummary |
| Stat number (accent) | 2rem | 700 | `--color-brand--2` | Statistics panel |
| Body / label | `--font-size-text` | 400–600 | `--color-light--2` | Descriptions |
| Nav link | 1.2rem → 1rem | 600 | `--color-light--2` | AppNav |
| Nav link (active) | same | 600 | on `--color-brand--1` bg | AppNav |
| Logo text | 16px | bold | `#ffffff` | Logo |
| Chart axis | 12px | 400 | `--color-light--2` | Recharts |
| Copyright | 1.2rem | 400 | `--color-light--1` | Sidebar footer |

Nav links and buttons use `text-transform: uppercase`.

---

## Spacing & Layout

| Token / Pattern | Value | Usage |
| --------------- | ----- | ----- |
| `--border-radius` | 10px | Cards, buttons, stat items |
| Card padding | 0.8rem – 2rem | Varies by component |
| Grid gap (stats) | 1.25rem | GazaSummary grid |
| Section gap | 2rem | Sidebar content stack |
| Sidebar width | 450px (fixed overlay) / 56rem (flex) | AppLayout / Sidebar |
| Map height | 600px | GazaMap container |
| Chart height | 450px → 300px (mobile) | ChartLine |
| Page margin (homepage) | 2.5rem | Homepages hero |
| Header padding | 1.5rem 2rem | AppLayout |

Breakpoints used consistently: **480px**, **768px**, **1024px**.

---

## Shadows

| Context | Value |
| ------- | ----- |
| Card default | `0 4px 6px rgba(0, 0, 0, 0.1)` |
| Card elevated | `0 4px 12px rgba(0, 0, 0, 0.15)` |
| Map container | `0 4px 16px rgba(0, 0, 0, 0.1)` |
| Homepage overlay | `0px 6px 15px rgba(0, 0, 0, 0.6)` |
| Logo image | `drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))` |

---

## Component Tokens

### Card (standard)

```
background: var(--color-card-bg)
border-radius: var(--border-radius)
padding: 0.8rem – 2rem
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
```

### Stat Item (clickable)

```
background: var(--color-dark--1)
border-radius: var(--border-radius)
padding: 1.5rem
display: flex, align-items: center
icon color: var(--color-brand--2), 2.4rem
value: var(--font-size-subtitle), weight 800, --color-light--1
label: var(--font-size-text), --color-light--2
hover: translateY(-2px), background --color-dark--0
```

### Primary Button

```
background: var(--color-brand--2)
color: var(--color-dark--1)
text-transform: uppercase
font-weight: 600–700
padding: 0.8rem 1.6rem – 1rem 3rem
border-radius: var(--border-radius) or 5px
hover: background var(--color-brand--1), color var(--color-light--2)
hover motion: translateY(-2px)
```

### Secondary / Ghost Button

```
background: var(--btn-bg-color) or transparent
color: var(--text-color)
border-radius: 8px
hover: var(--hover-bg-color)
```

### Range Slider

```
track: var(--color-dark--2), 4px height
thumb: var(--color-brand--2), 20px circle
thumb hover: scale(1.2), var(--color-brand--1)
active tick: var(--color-brand--2)
```

### Chart (Recharts)

```
container: var(--color-card-bg), 450px height
title: var(--font-size-subtitle), --color-light--1, centered
total badge: 24px bold, --color-brand--2 on --color-dark--1
axis labels: 12px, --color-light--2
```

### Leaflet Popup (global override in GazaMap.module.css)

```
background: var(--color-dark--1)
color: var(--color-light--2)
border-left: 5px solid var(--color-brand--2)
border-radius: 5px
tip: var(--color-dark--1)
```

### HeaderMap (target — spec only)

```
container: transparent, no white background — sits on AppLayout --bg-color
title: var(--font-size-subtitle), weight 700, --color-light--1
accent span: --color-brand--2
subtitle: var(--font-size-text), --color-light--2
location: --color-brand--1, capitalize
```

### RegionInfo Panel (target — spec only)

```
surface: var(--color-card-bg) — same depth as DetailsSummary .container
padding: 2rem
border-radius: var(--border-radius)
shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
title border-bottom: 2px solid var(--color-brand--2)
label: 1.4rem, --color-light--1, weight 500
value: var(--font-size-text), --color-light--2
colorIndicator: 8px bar, inline background from region GeoJSON color
```

### RegionTooltip (target — spec only)

```
surface: var(--color-dark--1) — matches Leaflet popup, not card-bg
border-left: 5px solid var(--color-brand--2)
padding: 1.2rem
shadow: 0 4px 12px rgba(0, 0, 0, 0.25)
title: var(--font-size-text), weight 600, --color-light--1
info line: 1.4rem, --color-light--2
inline label: --color-light--1, weight 600
font: var(--font-family-main)
```

### Scrollbar (Sidebar)

```
track: var(--color-dark--2), 8px
thumb: var(--color-brand--2)
thumb hover: var(--color-brand--1)
```

### Signature: Bloody Text (homepage only)

```
color: var(--color-brand--1)
text-shadow: layered crimson
animated drip pseudo-element
```

Use only on the landing page hero — not in the data dashboard.

---

## Chart & Map Colors

| Element | Color |
| ------- | ----- |
| Pie chart segments | Component-defined (Recharts) |
| Line chart stroke | `--color-brand--2` or component palette |
| Map region fills | GeoJSON property-driven |
| Legend dots | 20px circles, region-specific hex |
| Error state text | `--color-brand--1` |
| Loading text | `--color-light--2` |

---

## Invariants

- Never hardcode hex in JSX or CSS Modules — always use `var(--color-*)` tokens from `App.css`
- Font is Manrope only — loaded via Google Fonts in `App.css`
- Dark theme is default — light theme is opt-in via `.light-theme` class
- Crimson is for loss/errors; green is for life/actions — do not swap their roles
- Stat numbers are the visual thesis — always largest weight (800) in their container
- CSS Modules for dashboard feature styles; Tailwind utilities for shared UI/layouts; global utilities only in `App.css` (`.card`, `.cta`, `.red`, `.green`)
- One signature animation (`bloody-text`) — do not add decorative motion elsewhere without purpose
- Respect `@media (prefers-reduced-motion: reduce)` when adding new animations
