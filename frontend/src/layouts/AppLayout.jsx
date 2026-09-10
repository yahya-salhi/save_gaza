import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../shared/ui/Navbar.jsx";
import Footer from "../shared/ui/Footer.jsx";
import { useUiStore } from "../shared/stores/uiStore.js";

/**
 * Dashboard layout — Navbar + collapsible sidebar + content + Footer.
 * Sidebar uses var(--sidebar-width) and logical inset-inline-start.
 * Mobile: drawer with --overlay-bg backdrop.
 */

const NAV_ITEMS = [
  { to: "/app", label: "Overview" },
  { to: "/app/gaza", label: "Gaza" },
  { to: "/app/westBank", label: "West Bank" },
  { to: "/app/gazaMap", label: "Map" },
];

/**
 * @typedef {object} SidebarProps
 * @property {boolean} isOpen - Whether the mobile drawer is open
 * @property {() => void} onClose - Callback to close the drawer
 */

/**
 * Sidebar navigation — desktop persistent, mobile drawer.
 * @param {SidebarProps} props
 */
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-overlay backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed start-0 top-0 z-50 flex h-full flex-col border-e border-hairline bg-surface-1",
          "transition-transform duration-200 ease-in-out",
          // Top padding matches the navbar height token so links align
          // with the content column; both derive from --space-10.
          "w-[var(--sidebar-width)] pt-[var(--space-10)]",
          // Desktop: always visible
          "hidden md:flex",
        ].join(" ")}
      >
        <nav className="flex flex-col gap-1 p-4" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/app"}
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-2 text-sm no-underline transition-colors",
                  isActive
                    ? "bg-surface-3 text-accent-500 font-semibold"
                    : "text-text-2 hover:bg-surface-3 hover:text-text-1",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile drawer */}
      <aside
        className={[
          "fixed start-0 top-0 z-50 flex h-full flex-col border-e border-hairline bg-surface-1",
          "transition-transform duration-200 ease-in-out",
          // Capped so the drawer never exceeds the viewport on small
          // phones (sidebar token is wider than a 360px screen).
          "w-[var(--sidebar-width)] max-w-[calc(100vw-var(--space-10))] pt-[var(--space-10)]",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:hidden",
        ].join(" ")}
      >
        <nav className="flex flex-col gap-1 p-4" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/app"}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-2 text-sm no-underline transition-colors",
                  isActive
                    ? "bg-surface-3 text-accent-500 font-semibold"
                    : "text-text-2 hover:bg-surface-3 hover:text-text-1",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

/**
 * AppLayout — dashboard shell with collapsible sidebar.
 * Sidebar is persistent on desktop, drawer on mobile.
 */
export default function AppLayout() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const closeSidebar = useUiStore((s) => s.closeSidebar);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text-2 font-sans">
      <Navbar
        onMenuToggle={toggleSidebar}
        className="md:ms-[var(--sidebar-width)]"
      />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Main content — offset by sidebar width on desktop */}
        <main className="flex-1 md:ms-[var(--sidebar-width)]">
          <div className="mx-auto max-w-[var(--content-max)] p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
