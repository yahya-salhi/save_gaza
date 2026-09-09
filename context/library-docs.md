# Library Docs

Project-specific usage patterns for every third-party library in Save Gaza. Read the relevant section before implementing any feature that uses these libraries.

---

## Greenfield Notice

**Zero application code exists today.** All patterns below represent the target implementation patterns to be built starting with Phase 0 (Slice 0.1).

---

## React Router DOM

**Version:** v6 (`react-router-dom`)

### Setup (`frontend/src/App.jsx`)

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import AppLayout from "./layouts/AppLayout";
import HomePage from "./pages/HomePage";
import GazaPage from "./pages/GazaPage";
import WestBankPage from "./pages/WestBankPage";
import GazaMapPage from "./pages/GazaMapPage";
import SubmitPage from "./pages/SubmitPage";
import LoginPage from "./pages/LoginPage";
import ModerationPage from "./pages/ModerationPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/moderation" element={<ModerationPage />} />
        </Route>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<GazaPage />} />
          <Route path="gaza" element={<GazaPage />} />
          <Route path="westBank" element={<WestBankPage />} />
          <Route path="gazaMap" element={<GazaMapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Navigation Rules
- Use `<NavLink>` for navigation with active states:
  ```jsx
  <NavLink 
    to="/app/gaza" 
    className={({ isActive }) => isActive ? "text-accent-500 font-bold" : "text-text-2 hover:text-accent-500"}
  >
    Gaza
  </NavLink>
  ```
- Use `<Link>` for internal links (never `<a href>`).
- Filter detail states using URL query params (`useSearchParams`).

---

## Providers & State Management

All global providers live in `frontend/src/shared/providers/` (never `src/context/`).

### Provider Tree Composition (`frontend/src/main.jsx` / `App.jsx`)
```jsx
<ErrorBoundary>
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <App />
      </I18nProvider>
    </QueryClientProvider>
  </ThemeProvider>
</ErrorBoundary>
```

### ThemeProvider (`src/shared/providers/ThemeProvider.jsx`)
- Toggles `dark` class on `document.documentElement`.
- Persists user theme choice in `localStorage` under `sg-theme` (default: `dark`).
- Exposes `useTheme()` hook returning `{ theme, toggleTheme }`.

### TanStack Query v5 (Server State)
- Queries wrap `apiGet` from `shared/api/client.js` in custom hooks under `features/[feature]/hooks/`.
- Query keys are namespaced arrays (e.g. `["statistics", "gaza"]`).
- Canonical endpoint calls:
  ```js
  // features/statistics/hooks/useGazaDaily.js
  import { useQuery } from "@tanstack/react-query";
  import { apiGet } from "../../../shared/api/client";

  export function useGazaDaily() {
    return useQuery({
      queryKey: ["statistics", "gaza"],
      queryFn: () => apiGet("/statistics/gaza"),
      staleTime: 5 * 60 * 1000,
    });
  }
  ```

### Zustand v4/v5 (Global UI State)
- Client-only UI state (sidebar drawer, date filters, view modes).
- Never store server data in Zustand; use TanStack Query for server state.
  ```js
  // features/dashboard/stores/useDashboardStore.js
  import { create } from "zustand";

  export const useDashboardStore = create((set) => ({
    isSidebarOpen: false,
    toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
    closeSidebar: () => set({ isSidebarOpen: false }),
  }));
  ```

---

## Envelope Client (`frontend/src/shared/api/client.js`)

Single entry point for frontend HTTP calls.

```js
const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? "/api/v1" : "");

export async function apiGet(endpoint) {
  let url = `${API_BASE}${endpoint}`;
  
  // Dev-only fallback if VITE_API_BASE is completely empty
  if (!API_BASE && import.meta.env.DEV) {
    if (endpoint === "/statistics/gaza") {
      url = "https://data.techforpalestine.org/api/v2/casualties_daily.json";
    } else if (endpoint === "/statistics/west-bank") {
      url = "https://data.techforpalestine.org/api/v2/west_bank_daily.min.json";
    } else if (endpoint === "/summary") {
      url = "https://data.techforpalestine.org/api/v3/summary.json";
    }
  }

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody?.error?.message || `Request failed with status ${res.status}`;
    const code = errorBody?.error?.code || "HTTP_ERROR";
    const error = new Error(message);
    error.code = code;
    throw error;
  }

  const json = await res.json();
  // Standard backend envelope unwrapping
  if (json && typeof json === "object" && "success" in json) {
    if (!json.success) {
      const error = new Error(json.error?.message || "Unknown error");
      error.code = json.error?.code || "API_ERROR";
      throw error;
    }
    return json.data;
  }

  // Dev direct fallback returns raw array
  return json;
}
```

---

## Tailwind CSS Configuration & Tokens Mapping

In `frontend/tailwind.config.js`, all design tokens from `App.css` are mapped:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        text: {
          1: "var(--text-1)",
          2: "var(--text-2)",
          3: "var(--text-3)",
          "on-accent": "var(--text-on-accent)",
        },
        accent: {
          50: "var(--accent-50)",
          100: "var(--accent-100)",
          200: "var(--accent-200)",
          300: "var(--accent-300)",
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
          700: "var(--accent-700)",
          800: "var(--accent-800)",
          900: "var(--accent-900)",
        },
        hairline: "var(--hairline)",
        "hairline-strong": "var(--hairline-strong)",
        verified: "var(--verified)",
        danger: "var(--danger)",
        warning: "var(--warning)",
        info: "var(--info)",
        overlay: "var(--overlay-bg)",
      },
      fontFamily: {
        display: "var(--font-display)",
        mono: "var(--font-mono)",
        sans: "var(--font-sans)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        "sidebar": "var(--sidebar-width)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        e1: "var(--elevation-1)",
        e2: "var(--elevation-2)",
        e3: "var(--elevation-3)",
        focus: "var(--focus-ring)",
      },
    },
  },
  plugins: [],
};
```

---

## Radix UI Dialog (Mobile Drawer Example with Logical CSS)

```jsx
import * as Dialog from "@radix-ui/react-dialog";
import { X, Menu } from "lucide-react";

export function MobileNav() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button aria-label="Open Navigation Menu" className="p-2 text-text-1">
          <Menu className="w-6 h-6" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-overlay backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed inset-block-start-0 inset-inline-end-0 w-72 h-full bg-surface-1 p-6 z-50 shadow-e3 border-inline-start border-hairline">
          <div className="flex items-center justify-between mb-8">
            <span className="font-display font-black text-text-1">SAVE GAZA</span>
            <Dialog.Close asChild>
              <button aria-label="Close Navigation Menu" className="p-2 text-text-2 hover:text-text-1">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>
          {/* Nav links */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

---

## Zod Runtime Contracts (Both Boundaries)

Zod ≥ 3.23. Validates client form inputs and server API payloads.

### Summary DTO Schema (`/api/v1/summary`)
The summary contract standardizes on the TechForPalestine **v3** `summary.json`
nested multi-region shape (gaza / west_bank / lebanon / known_killed_in_gaza /
known_press_killed_in_gaza). The backend entity, Zod schema, and the frontend
fixture all mirror this exact shape.

```javascript
import { z } from "zod";

const CasualtyBreakdownSchema = z.object({
  total: z.number().int().nonnegative(),
  children: z.number().int().nonnegative().optional(),
  women: z.number().int().nonnegative().optional(),
  civil_defence: z.number().int().nonnegative().optional(),
  press: z.number().int().nonnegative().optional(),
  medical: z.number().int().nonnegative().optional(),
});

export const SummarySchema = z.object({
  gaza: z.object({
    reports: z.number().int().nonnegative(),
    last_update: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    massacres: z.number().int().nonnegative(),
    killed: CasualtyBreakdownSchema,
    famine: z.record(z.string(), z.unknown()).default({}),
    aid_seeker: z.record(z.string(), z.unknown()).default({}),
    injured: z.object({ total: z.number().int().nonnegative() }),
  }),
  west_bank: z.object({
    reports: z.number().int().nonnegative(),
    last_update: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    settler_attacks: z.number().int().nonnegative(),
    killed: z.object({
      total: z.number().int().nonnegative(),
      children: z.number().int().nonnegative(),
    }),
    injured: z.object({
      total: z.number().int().nonnegative(),
      children: z.number().int().nonnegative(),
    }),
  }),
  lebanon: z.object({
    reports: z.number().int().nonnegative(),
    first_report: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    last_update: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    killed: z.object({ total: z.number().int().nonnegative() }),
    injured: z.object({ total: z.number().int().nonnegative() }),
  }),
  known_killed_in_gaza: z.object({
    records: z.number().int().nonnegative(),
    pages: z.number().int().nonnegative(),
    page_size: z.number().int().nonnegative(),
    male: z.object({
      adult: z.number().int().nonnegative(),
      senior: z.number().int().nonnegative(),
      child: z.number().int().nonnegative(),
    }),
    female: z.object({
      adult: z.number().int().nonnegative(),
      senior: z.number().int().nonnegative(),
      child: z.number().int().nonnegative(),
    }),
    last_update: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    includes_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  known_press_killed_in_gaza: z.object({
    records: z.number().int().nonnegative(),
  }),
});
```


### Incident Submission Schema (`/api/v1/incidents`)
```javascript
export const IncidentSubmissionSchema = z.object({
  title: z.string().min(5).max(150),
  description: z.string().min(10).max(2000),
  reportDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  region: z.enum(["gaza", "west-bank"]),
  latitude: z.number().min(31.0).max(32.6),
  longitude: z.number().min(34.1).max(35.6),
  sourceUrl: z.string().url("Must be a valid source URL"),
  evidenceUrl: z.string().url().optional(),
  turnstileToken: z.string().min(1, "Turnstile anti-bot verification required"),
});
```

---

## Leaflet + React-Leaflet Overrides (CSS Modules)

Leaflet injects DOM elements directly. Style popups with `:global()` selectors using logical CSS:

```css
:global(.leaflet-popup .leaflet-popup-content-wrapper) {
  background-color: var(--surface-2);
  color: var(--text-2);
  border-inline-start: 4px solid var(--accent-500);
  border-radius: var(--radius-sm);
  box-shadow: var(--elevation-2);
}

:global(.leaflet-popup-tip) {
  background-color: var(--surface-2);
}
```