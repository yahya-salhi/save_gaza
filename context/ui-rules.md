# UI Rules

Concise rules for building Save Gaza UI. The app is a dark humanitarian dashboard — verified statistics first, maps second, advocacy copy on the landing page only. Match existing CSS Module patterns before inventing new ones.

---

## Styling System

- **CSS Modules** for all component styles (`ComponentName.module.css`)
- **Global tokens** in `save_Gaza/src/App.css` (`:root` variables)
- **No Tailwind** in the current codebase — do not introduce it without a dedicated migration ticket
- Reference tokens as `var(--color-brand--2)` — never raw hex in module files

---

## Font

Manrope is loaded globally in `App.css`:

```css
@import "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap";
```

Applied via `--font-family-main` on `body`. Do not swap fonts per component.

---

## Layout Architecture

### Landing Page (`/`)

- Full-viewport hero with background image + dark gradient overlay
- Centered content column, max-width ~1200px
- CTA links to `/app` routes
- Uses global classes from `App.css` (`.cta`, `.bloody-text`, `.card`)

### App Dashboard (`/app/*`)

Split layout with collapsible sidebar:

```
┌─────────────────────────────────────────────┐
│  Header: Logo | "War in Gaza" | Learn More  │
├──────────┬──────────────────────────────────┤
│ Sidebar  │  Main: HeaderMap + Map/Charts    │
│ (stats)  │                                  │
└──────────┴──────────────────────────────────┘
```

- Sidebar: fixed overlay, 450px wide, slides from left
- Main: flex-grow, scrollable, contains map/chart content
- Mobile (≤768px): sidebar goes full-width overlay

---

## Color Semantics

| Color | Token | When to use |
| ----- | ----- | ----------- |
| Crimson | `--color-brand--1` | Errors, "War" text, active nav, button hover, injury/loss emphasis |
| Green | `--color-brand--2` | Icons, CTAs, "in Gaza" text, chart highlights, scrollbar, borders |
| Dark cards | `--color-card-bg` | Panel containers |
| Nested items | `--color-dark--1` | Individual stat cards, popups |
| Muted text | `--color-light--1` | Headings, large numbers |
| Body text | `--color-light--2` | Labels, descriptions, nav links |

Never use green for error states or crimson for success/CTA backgrounds.

---

## Cards

Every data section lives in a card:

```
background: var(--color-card-bg)
border-radius: var(--border-radius)   /* 10px */
padding: 0.8rem – 2rem
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
```

Nested stat items use `--color-dark--1` inside the card — two levels of dark surface, not colored backgrounds.

---

## Typography Hierarchy

Three levels, used consistently:

**Stat numbers** — the thesis of each panel

```
font-size: var(--font-size-subtitle)  /* 2.4rem */
font-weight: 800
color: var(--color-light--1)
```

**Section headings** — chart titles, panel titles

```
font-size: var(--font-size-subtitle)
font-weight: 600
color: var(--color-light--1)
```

**Labels / body**

```
font-size: var(--font-size-text)  /* 1.6rem */
font-weight: 400–600
color: var(--color-light--2)
```

Section titles in DetailsSummary add a green bottom border:

```
border-bottom: 2px solid var(--color-brand--2)
```

---

## Navigation

### AppNav (sidebar, vertical → horizontal on tablet)

- Background: `--color-dark--2`
- Links: uppercase, 600 weight, `--color-light--2`
- Hover: `--color-brand--2` background, translateY(-2px)
- Active: `--color-brand--1` background

### PageNav (top-level site nav)

- Horizontal links, uppercase, 1.5rem
- Active (React Router): `--color-brand--2` via `:global(.active)`
- CTA link: green background button variant

Routes: `/app/gaza`, `/app/westBank`, `/app/gazaMap`

---

## Buttons

**Primary (action):**

```
background: var(--color-brand--2)
color: var(--color-dark--1)
text-transform: uppercase
font-weight: 700
border-radius: var(--border-radius)
hover: var(--color-brand--1) background, var(--color-light--2) text
```

**Header buttons (Learn More, Menu):**

```
background: var(--btn-bg-color)
color: var(--text-color)
border-radius: 8px
hover: var(--hover-bg-color), translateY(-2px)
```

**Back button:**

```
background: none
border: 1px solid currentColor
hover: var(--color-dark--2) background
```

---

## Stat Grid Pattern

Used by GazaSummary, WestBankSummary, Statistics:

```
display: grid
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
gap: 1.25rem
```

Each item: flex row with icon (green, 2.4rem) + value/label column. Clickable items wrap in React Router `<Link>`.

---

## Map Sub-Components — Dark Token Spec

Three map-related components have a documented dark migration spec in `ui-registry.md`. **Do not use their current light-theme code as reference** — use the spec below.

### HeaderMap

Sits above the map/chart in AppLayout main area. No own background — transparent on dashboard `--bg-color`.

| Element | Spec |
| ------- | ---- |
| Heading | `--color-light--1`, subtitle size, weight 700 |
| "Daily casualties" accent | `--color-brand--2` via `.accent` class |
| Region label (gaza/westbank) | `--color-brand--1`, capitalize |
| Body context line | `--color-light--2`, text size |

Must import and use `HeaderMap.module.css` — do not rely on global `.green`.

### RegionInfo

Fixed panel beside GazaMap (400px grid column). Same card language as DetailsSummary.

| Element | Spec |
| ------- | ---- |
| Panel surface | `--color-card-bg` |
| Title | Green bottom border (`--color-brand--2`), same as DetailsSummary |
| Labels | `--color-light--1` |
| Values / lists | `--color-light--2` |
| Region color bar | Inline `background-color` from GeoJSON only exception |

Empty state copy ("Click on a region…") uses `--color-light--2` — not gray hex.

### RegionTooltip

Hover tooltip on map polygons. Must visually match Leaflet popup overrides.

| Element | Spec |
| ------- | ---- |
| Surface | `--color-dark--1` (not `--color-card-bg` — tooltips are one level darker) |
| Left accent | 5px `--color-brand--2` border |
| Title | `--color-light--1` |
| Stat lines | `--color-light--2` with `--color-light--1` labels |

### Migration Checklist (implement in code when ready)

- [ ] HeaderMap.jsx imports module CSS, drops global `.green`
- [ ] HeaderMap.module.css — all hex replaced with tokens
- [ ] RegionInfo.module.css — white/`#333`/`#666`/`#eee` replaced
- [ ] RegionInfo.module.css — add missing `.subTitle` class
- [ ] RegionTooltip.module.css — dark surface + green accent border
- [ ] Visual parity: RegionTooltip ≈ Leaflet popup in GazaMap

---

- **Recharts** for line charts and pie charts — container uses card token pattern
- **Leaflet + react-leaflet** for geographic maps
- Leaflet popup styles use `:global()` selectors in `GazaMap.module.css` — required because Leaflet injects its own class names
- Map container: 600px height, 12px border-radius, overflow hidden
- ChartLine includes absolute-positioned total killed badge (top-right)

---

## Loading & Error States

Every data component must handle three states:

```jsx
if (isLoading) return <div className={styles.loading}>Loading...</div>;
if (error || !data) return <div className={styles.error}>No data available</div>;
```

- Loading: centered, `--color-light--2`
- Error: centered, `--color-brand--1`
- Never show raw API error messages — use human-readable text

---

## Icons

- **react-icons/fa** for stat categories (FaChild, FaHeartBroken, etc.)
- **lucide-react** for UI chrome (Menu, X in AppLayout)
- Icon color: always `--color-brand--2` in stat cards

---

## Responsive Rules

| Breakpoint | Behavior |
| ---------- | -------- |
| ≤1024px | Stat grid minmax 240px; GazaMap single column |
| ≤768px | Sidebar full-width overlay; reduced font sizes (×0.8–0.9); 2-col stat grid |
| ≤480px | Single-column stat grid; further font reduction (×0.7–0.8) |

Use `calc(var(--font-size-subtitle) * 0.8)` pattern for scaled type — do not hardcode rem values per breakpoint.

---

## Motion

Existing motion patterns (keep consistent):

- Hover lift: `transform: translateY(-2px)` on cards and buttons
- Transition: `all 0.3s ease` standard
- Spinner: conic-gradient rotation, 1.5s linear infinite
- Bloody-text drip: landing page only — do not replicate elsewhere

Add `@media (prefers-reduced-motion: reduce)` overrides when introducing new animations.

---

## Accessibility

- Toggle buttons need `aria-label` (see AppLayout menu button)
- Focus states on interactive elements — outline or background change
- Sufficient contrast: light text on dark surfaces (already met by token pairs)
- HeaderMap supports `@media (forced-colors: active)` — follow this pattern for new components

---

## Do Nots

- Never use white card backgrounds in the dashboard — dark surfaces only
- Never add gradients to dashboard cards (gradients are for homepage hero only)
- Never use more than two levels of `--border-radius` nesting
- Never use `position: fixed` for layout elements except the sidebar overlay and toggle button
- Never introduce a third accent color — crimson and green carry all semantic weight
- Never show raw API/JSON errors to users
- Never mix CSS Module class names with inline styles for colors
- Never use RegionInfo's **current** light theme (`white`, `#333`) in new work — use the dark spec in `ui-registry.md` and `ui-tokens.md`
- Never use HeaderMap's **current** unused module CSS (white bg, slate hex) — use the transparent dark spec
- Never use RegionTooltip's **current** white tooltip — match `--color-dark--1` + green left border
