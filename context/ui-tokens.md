# UI Tokens

Design tokens for **Save Gaza** — a dark humanitarian data instrument for verified casualty statistics, interactive maps, and crisis telemetry. Direction: **Refined Observatory** — data as testimony, presented with the precision of a scientific instrument. All tokens live in `frontend/src/App.css` (`:root`) and are mapped into `frontend/tailwind.config.js`. Consume via `var(--token)` in CSS Modules and via mapped Tailwind classes in shared UI.

---

## Design Direction

| Axis | Choice |
| ---- | ------ |
| Subject | Humanitarian crisis data — Gaza & West Bank casualty tracking |
| Audience | Advocates, researchers, journalists, general public |
| Aesthetic | Refined Observatory — obsidian surfaces, layered elevation, hairline structure |
| Signature | Verified tally as an instrument — timestamped mono readout with a live ticker |
| Accent | A single **cool-crimson** ramp marks the data itself; green is focus/verified dots only |

**Palette intent:** Obsidian backgrounds keep focus on the numbers. A cool, saturated crimson (`--accent-500`) is the one data accent — figures, ticker dot, dates, active state. Its ramp carries hovers, borders, and pressed states. Green (`--verified`) is reserved strictly for keyboard focus rings and small verified status dots only. Never use green for badges, buttons, or large surfaces. Never introduce a second brand accent.

---

## How to Use

Two systems share one palette:

1. **Tailwind** — shared UI + layouts (`src/layouts`, `src/shared/*`). Palette + scales mapped in `tailwind.config.js`; `darkMode: "class"` (ThemeProvider toggles `dark` on `<html>`).
2. **CSS Modules + CSS variables** — dashboard feature components (maps, stats, charts).

```jsx
// Tailwind (shared UI)
<div className="bg-surface-1 text-text-1 p-4 rounded-md shadow-e2">…</div>

// CSS Module (dashboard feature) referencing tokens
.card { background: var(--surface-1); box-shadow: var(--elevation-2); border-radius: var(--radius-md); }

// Never — raw hex in components
<div style={{ color: "#e11d48" }} />
```

---

## Color Tokens

Cool-crimson accent ramp (single data accent). Base is `--accent-500`. Defined in `frontend/src/App.css`:

```css
:root {
  /* Accent — cool-crimson ramp */
  --accent-50:  #fff1f3;
  --accent-100: #ffe0e5;
  --accent-200: #fdc6cf;
  --accent-300: #fa9db0;
  --accent-400: #f5648a;
  --accent-500: #e11d48; /* base — the data accent */
  --accent-600: #be123c;
  --accent-700: #9f1239;
  --accent-800: #881337;
  --accent-900: #4c0519;

  /* Surfaces — obsidian, layered (dark, primary) */
  --bg:         #0b0d0f; /* page background */
  --surface-1:  #14171a; /* card surface */
  --surface-2:  #1b1f23; /* nested item surface */
  --surface-3:  #23282d; /* elevated / hover surface */
  --overlay-bg: rgba(11, 13, 15, 0.75); /* modal backdrop & mobile overlay with blur */

  /* Text */
  --text-1:         #f4f6f7; /* primary bright */
  --text-2:         #c2c9ce; /* body / labels */
  --text-3:         #8b949c; /* muted / captions */
  --text-on-accent: #ffffff; /* text on accent-500 buttons */

  /* Structure */
  --hairline:        rgba(255, 255, 255, 0.08);
  --hairline-strong: rgba(255, 255, 255, 0.14);

  /* Reserved — focus rings & verified status dots only (never badges or backgrounds) */
  --verified: #22c55e;

  /* Status (system feedback only — not brand) */
  --danger:  var(--accent-500);
  --warning: #f59e0b;
  --info:    #38bdf8;
}
```

### Semantic Roles

| Role | Token | Usage |
| ---- | ----- | ----- |
| Page background | `--bg` | `body`, map/chart canvases |
| Card surface | `--surface-1` | Panels, charts, forms |
| Nested surface | `--surface-2` | Stat cards, popups, inputs |
| Elevated / hover | `--surface-3` | Hover states, menus, tooltips |
| Backdrop overlay | `--overlay-bg` | Modal backdrops, mobile sidebar drawer |
| Primary text | `--text-1` | Headings, key figures |
| Body text | `--text-2` | Labels, descriptions, nav links |
| Muted text | `--text-3` | Captions, footnotes, placeholders |
| Contrast text | `--text-on-accent` | Text inside `--accent-500` primary buttons |
| Data accent | `--accent-500` | The tally, ticker dot, dates, active nav |
| Accent hover/border | `--accent-400` / `--accent-600` | Hover, chart line, borders, pressed |
| Focus / verified dot | `--verified` | Keyboard focus rings (`--focus-ring`), verified status dots |
| Hairline | `--hairline` | 1px dividers, card borders, ticker rule |

---

## Typography

Three-role type system, loaded in `App.css` from Google Fonts. Root font-size is `62.5%` on `html` (1rem = 10px). Data is IBM Plex Mono `500` with `font-variant-numeric: tabular-nums` and bidi-isolation (`unicode-bidi: isolate`) so digits never shift width or flip in RTL.

```css
:root {
  --font-display: "Archivo", sans-serif;      /* 900 — display & hero headings */
  --font-mono:    "IBM Plex Mono", monospace; /* 400/500 — data, figures, ticker */
  --font-sans:    "Manrope", sans-serif;      /* 400–800 — body & UI chrome */
}
```

### Type Scale

```css
:root {
  --text-xs:   1.2rem;  /* captions, footnotes */
  --text-sm:   1.4rem;  /* labels, meta */
  --text-base: 1.6rem;  /* body */
  --text-lg:   2.0rem;  /* lead, sub-headings */
  --text-xl:   2.4rem;  /* section titles */
  --text-2xl:  3.2rem;  /* page titles */
  --text-3xl:  4.0rem;  /* hero heading */
  --text-4xl:  clamp(5.6rem, 12vw, 9.6rem); /* the hero tally */

  --leading-tight: 1.15; --leading-snug: 1.35; --leading-normal: 1.6;
  --tracking-wide: 0.06em; --tracking-widest: 0.14em;
}
```

---

## Spacing & Dimensions Scale

```css
:root {
  --space-1: 0.4rem;  --space-2: 0.8rem;  --space-3: 1.2rem; --space-4: 1.6rem;
  --space-5: 2.4rem;  --space-6: 3.2rem;  --space-8: 4.8rem; --space-10: 6.4rem;

  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-full: 9999px;

  --content-max: 1200px;
  --sidebar-width: 420px;
  --map-height: 600px;

  --icon-sm: 1.6rem;
  --icon-md: 2.4rem;
  --icon-lg: 3.2rem;

  --motion-lift: -2px;
}
```

---

## Elevation & Focus

```css
:root {
  --elevation-0: none;
  --elevation-1: 0 1px 2px rgba(0,0,0,0.30);
  --elevation-2: 0 4px 12px rgba(0,0,0,0.35);
  --elevation-3: 0 10px 28px rgba(0,0,0,0.45);
  --focus-ring:  0 0 0 3px color-mix(in srgb, var(--verified) 55%, transparent);
}
```

---

## Component Tokens

### Primary Button
```
background: var(--accent-500); color: var(--text-on-accent); text-transform: uppercase; font-weight: 700;
padding: var(--space-3) var(--space-5); border-radius: var(--radius-md);
hover: var(--accent-600), transform: translateY(var(--motion-lift)); focus-visible: var(--focus-ring);
```

### Verified Dot Status Indicator
```
display: inline-flex; align-items: center; gap: var(--space-2);
dot: width 8px, height 8px, border-radius 50%, background var(--verified);
label: var(--text-sm), color var(--text-2); (NEVER full green background badge)
```

### Leaflet Popup / Tooltip (global override)
```
background: var(--surface-2); color: var(--text-2);
border-inline-start: 4px solid var(--accent-500); border-radius: var(--radius-sm);
box-shadow: var(--elevation-2);
```

---

## Invariants
- Zero hardcoded hex values in JSX or CSS Modules (`#fff`, `#000`, etc. prohibited — use `--text-on-accent`, `--bg`, etc.).
- Direction-agnostic layout only: logical properties (`margin-inline`, `padding-inline`, `inset-inline-start/end`).
- Verified green (`--verified`) is strictly for focus rings and status dots — never for buttons, cards, or badges.