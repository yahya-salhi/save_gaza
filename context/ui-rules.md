# UI Rules

Construction rules for the Save Gaza UI, aligned to `ui-tokens.md` (**Refined Observatory**). The app is a dark humanitarian data instrument styled as a **verified tally** — the documented figure opens the page, timestamped and in mono type; maps and charts follow; advocacy copy stays on the landing page only.

---

## Zero Greenfield Application Code Notice
As of today, **no application code has been written**. All scaffolding and features will be implemented fresh starting in Phase 1 (Slice 0.1 & 1.1).

---

## Styling System

- **Tailwind** for shared UI + layouts (`src/layouts`, `src/shared/*`) — palette + scales mapped in `tailwind.config.js` from `App.css` tokens; `darkMode: "class"` (ThemeProvider toggles `dark` on `<html>`).
- **CSS Modules** for dashboard feature components (`ComponentName.module.css`).
- **Global tokens** in `frontend/src/App.css` (`:root` variables).
- Both systems consume the same tokens — never raw hex, spacing, radii, or shadow values in either.
- Reference tokens as `var(--accent-500)` / `var(--surface-1)` in modules, or the mapped Tailwind classes in JSX.

---

## Direction-Agnostic Layout (RTL & Logical CSS)

Layout is strictly **direction-agnostic**. Never use physical `left`, `right`, `margin-left`, `padding-right`, `border-left`, etc.

| Physical (Prohibited) | Logical (Mandatory) |
| --------------------- | ------------------- |
| `left: 0` / `right: 0` | `inset-inline-start: 0` / `inset-inline-end: 0` |
| `margin-left: 1rem` | `margin-inline-start: 1rem` |
| `padding-right: 2rem`| `padding-inline-end: 2rem` |
| `border-left: 4px solid ...` | `border-inline-start: 4px solid ...` |
| `text-align: left` | `text-align: start` |

### Numerals & Bidi-Isolation
Numerals and timestamps must maintain LTR reading order even within Arabic RTL text:
```jsx
<span dir="ltr" className="font-mono tabular-nums inline-block [unicode-bidi:isolate]">
  {formatNumber(killedCount)}
</span>
```

---

## Color Semantics & The "Verified" Rule

| Color | Token | When to Use |
| ----- | ----- | ----------- |
| Data accent | `--accent-500` | The tally, ticker dot, dates, active nav, primary buttons |
| Accent hover / border | `--accent-400` / `--accent-600` | Hover, chart line, stat icons, borders, pressed |
| Verified green | `--verified` | Keyboard focus rings (`--focus-ring`), status indicator dots only |
| Card surface | `--surface-1` | Panel containers |
| Nested surface | `--surface-2` | Individual stat cards, inputs, popups |
| Elevated surface | `--surface-3` | Hover states, menus, tooltips |
| Contrast text | `--text-on-accent` | Text inside primary buttons (`#ffffff`) |

> **Strict Invariant**: NEVER render a full-width green badge, green card, or green CTA button. Verification is indicated by a subtle 8px green dot (`bg-verified`) beside neutral text (`--text-2`).

---

## Four Visual States Standard

Every data-dependent or form-dependent component must implement and visually test all four states:

```
┌────────────────────────────────────────────────────────┐
│ 1. Loading: Skeleton placeholder (animate-pulse)       │
├────────────────────────────────────────────────────────┤
│ 2. Empty: Neutral prompt message (--text-3)            │
├────────────────────────────────────────────────────────┤
│ 3. Error: Human-readable notice + Retry button         │
├────────────────────────────────────────────────────────┤
│ 4. Populated: Full data representation                 │
└────────────────────────────────────────────────────────┘
```

Component template:
```jsx
if (isLoading) return <Skeleton count={4} />;
if (isError)   return <ErrorState message="Casualty records temporarily unavailable" onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState message="No casualty reports recorded for this period" />;
return <PopulatedView data={data} />;
```

---

## Form States & Validation (Submissions)

Form components have their own 4-state lifecycle:
1. **Pristine / Idle**: Default form inputs with placeholder tokens (`--text-3`).
2. **Submitting**: Disabled inputs, spinner on primary button, Turnstile verification active.
3. **Validation Error**: Client-side Zod boundary validation errors rendered under each input in `--danger` with `aria-invalid="true"`.
4. **Success**: Confirmation card with generated report tracking ID and reset trigger.

---

## Leaflet Overrides (CSS Modules)
Leaflet injects DOM elements directly. Style popups with `:global()` selectors using logical CSS:
```css
:global(.leaflet-popup .leaflet-popup-content-wrapper) {
  background-color: var(--surface-2);
  color: var(--text-2);
  border-inline-start: 4px solid var(--accent-500);
  border-radius: var(--radius-sm);
  box-shadow: var(--elevation-2);
}
```

---

## Accessibility (a11y) Rules
- All interactive elements must show `--focus-ring` on `:focus-visible`.
- Icon buttons must have an explicit `aria-label`.
- The live ticker dot must be wrapped in `<span aria-live="polite">` so screen readers receive updates.
- All animations must respect `@media (prefers-reduced-motion: reduce)`.