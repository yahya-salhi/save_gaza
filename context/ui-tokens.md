# UI Tokens

Design tokens for **Save Gaza** — a dark humanitarian dashboard for verified casualty statistics, interactive maps, and crisis telemetry. All tokens live in `save_Gaza/src/App.css` (`:root`) and are consumed via CSS Modules using `var(--token-name)`.

---

## Design Direction

| Axis | Choice |
| ---- | ------ |
| Subject | Humanitarian crisis data — Gaza & West Bank casualty tracking |
| Audience | Advocates, researchers, journalists, general public |
| Aesthetic | Dark observatory — data as testimony, not decoration |
| Signature | Verified tally as an instrument — timestamped mono readout with a live ticker; crimson is the single data accent |

**Palette intent:** Obsidian backgrounds keep focus on numbers. Crimson (`--color-brand--1`) is the single accent — it marks the data itself (figures, ticker dot, dates). A light crimson (`--color-brand--2`) carries hovers and secondary highlights. Green is reserved for keyboard focus rings and "verified" status dots only. Never introduce another accent color.

---

## How to Use

Two systems share the same palette (Ticket 01):

1. **Tailwind CSS** — for shared UI + layouts (`src/layouts`, `src/shared/ui`, `src/shared/providers`). Palette mapped in `save_Gaza/tailwind.config.js`: `background-dark`, `card`, `brand-crimson`, `verified`, `dark-0..2`, `light-1..3` + `font-display` / `font-mono`. Dark mode is class-based (`darkMode: "class"` — `ThemeProvider` toggles `dark` on `<html>`).
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

  /* Brand — crimson (data/accent) & light crimson (hover/secondary) */
  --color-brand--1: #c41e3a;
  --color-brand--2: #e0556b;

  /* Reserved — focus rings & "verified" status dots only */
  --color-verified: #2ecc71;

  /* Typography */
  --font-family-main: "Manrope", sans-serif;
  --font-display: "Archivo", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  --font-size-title: 4.8rem;
  --font-size-subtitle: 2.4rem;
  --font-size-text: 1.6rem;

  /* Other */
  --border-radius: 10px;
  --hairline: rgba(255, 255, 255, 0.08);
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
| Data accent / figures | `--color-brand--1` | The tally, ticker dot, dates, errors, active nav |
| Secondary accent / hover | `--color-brand--2` | Hover states, chart line, slider thumb, stat icons |
| Focus / verified | `--color-verified` | Keyboard focus rings, "verified" status dots |
| Hairline rule | `--hairline` | 1px section dividers, ticker border, card borders |

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

Three-role type system, imported in `App.css` from Google Fonts:

```css
--font-display: "Archivo", sans-serif;    /* 900 — headlines & hero headings */
--font-mono: "IBM Plex Mono", monospace;  /* 400/500 — data, figures, labels, ticker */
--font-family-main: "Manrope", sans-serif;/* 400–700 — body copy, UI chrome */
--font-size-title: 4.8rem;
--font-size-subtitle: 2.4rem;
--font-size-text: 1.6rem;
```

Root font-size is `62.5%` on `html` (1rem = 10px). Data is set in IBM Plex Mono with `font-weight: 500` and `font-variant-numeric: tabular-nums` so digits never shift width. Do not add fonts per-component — reuse the three roles.

| Element | Family | Size | Weight | Color | Context |
| ------- | ------ | ---- | ------ | ----- | ------- |
| Hero figure (the tally) | mono | 100px (clamps to 70px mobile) | 500 | `--color-brand--1` | Homepages hero |
| Hero heading "The death toll in Gaza" | display | 2rem → 3.4rem | 900 | `--color-light--1` | Homepages hero |
| App header "WAR IN GAZA" | display | 1.8rem | 900 | `--color-light--1` + crimson accent | AppLayout |
| Live ticker / kicker | mono | 1.1rem | 500 | `--color-brand--1` | Homepages / HeaderMap |
| Section title | main | `--font-size-subtitle` | 600–800 | `--color-light--1` | Cards, charts |
| Stat number | mono | `--font-size-subtitle` | 500 | `--color-light--1` | GazaSummary |
| Stat number (accent) | mono | 2rem | 500 | `--color-brand--2` | Statistics panel |
| Body / label | main | `--font-size-text` | 400–600 | `--color-light--2` | Descriptions |
| Nav link | main | 1.2rem → 1rem | 600 | `--color-light--2` | AppNav |
| Nav link (active) | main | same | 600 | on `--color-brand--1` bg | AppNav |
| Logo text | main | 16px | bold | `#ffffff` | Logo |
| Chart axis | main | 12px | 400 | `--color-light--2` | Recharts |
| Copyright | main | 1.2rem | 400 | `--color-light--1` | Sidebar footer |

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
| Homepage container | max-width 1200px, padding 0 2rem | Homepages hero |
| Header padding | 1rem 2rem | AppLayout |

Breakpoints used consistently: **480px**, **768px**, **1024px**.

---

## Shadows

| Context | Value |
| ------- | ----- |
| Card default | `0 4px 6px rgba(0, 0, 0, 0.1)` |
| Card elevated | `0 4px 12px rgba(0, 0, 0, 0.15)` |
| Map container | `0 4px 16px rgba(0, 0, 0, 0.1)` |
| Video frame | `1px solid var(--hairline)`, radius `var(--border-radius)` | Homepages video section |
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
value: var(--font-mono), 500, tabular-nums, var(--font-size-subtitle), --color-light--1
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
background: var(--color-dark--2) or transparent
color: var(--text-color)
border-radius: 8px
hover: var(--color-dark--0)
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

### HeaderMap (implemented)

```
container: var(--color-card-bg) dark panel, top corners radius var(--border-radius)
kicker: "LIVE RECORD", var(--font-mono), 500, --color-brand--1, uppercase, letter-spacing
title: "The human toll · Gaza/West Bank", display 900, --color-light--1
location / accent span: --color-brand--2
subtitle: var(--font-size-text), --color-light--2
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

> Accent references here use `--color-brand--2`, which now resolves to light crimson `#e0556b`.

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

### Signature: Instrument Hero (homepage only)

```
container: max-width 1200px, min-height 72vh, centered
live ticker: mono 500, --color-brand--1, hairline underline, pulsing dot
hero figure: the documented tally, mono 500 tabular-nums, clamp(70px–100px), --color-brand--1
caption: "verified killed · since 07 Oct 2023", mono, --color-light--1
stats dl: injured / West Bank killed, mono figures, --color-light--2
hairline rule: 1px var(--hairline) separates figure from ticker and stats
```

Use on the landing page hero only — the figure must open the page with the data itself, not a template slogan.

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
- Three-role type system only — Archivo 900 for display, IBM Plex Mono for data, Manrope for body; no per-component fonts
- Dark theme is default — light theme is opt-in via `.light-theme` class
- Crimson is the single data accent; green is focus rings / "verified" status dots only — do not swap their roles
- Stat numbers are the visual thesis — always IBM Plex Mono 500 with tabular-nums in their container
- CSS Modules for dashboard feature styles; Tailwind utilities for shared UI/layouts; global utilities only in `App.css` (`.card`, `.cta`, `.red`)
- One signature motion (live ticker pulse on the homepage) — do not add decorative motion elsewhere without purpose
- Respect `@media (prefers-reduced-motion: reduce)` when adding new animations
