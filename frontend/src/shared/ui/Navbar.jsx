import { Link, NavLink } from "react-router-dom";

/**
 * @typedef {object} NavbarProps
 * @property {(() => void) | null} [onMenuToggle] - Callback when hamburger menu is clicked
 * @property {string} [className] - Additional CSS classes
 */

const NAV_LINKS = [
  { to: "/app", label: "Dashboard" },
  { to: "/submit", label: "Report" },
];

/**
 * Top navigation bar — logo, nav links with active indicator, hamburger
 * toggle for mobile sidebar. Uses backdrop blur on scroll, logical CSS
 * properties for RTL. Active section is marked with the data accent.
 *
 * @param {NavbarProps} props
 */
export default function Navbar({ onMenuToggle = null, className = "" }) {
  return (
    <header
      className={[
        "sticky top-0 z-40 flex h-[var(--space-10)] items-center justify-between border-b border-hairline px-[var(--space-5)]",
        "bg-bg/95 backdrop-blur",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link
        to="/"
        className="shrink-0 whitespace-nowrap font-display text-lg font-black tracking-wide text-text-1 no-underline transition-colors hover:text-accent-400"
      >
        Save Gaza
      </Link>

      <nav aria-label="Primary" className="flex items-center gap-5">
        <div className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "text-sm no-underline transition-colors",
                  isActive
                    ? "font-semibold text-accent-500"
                    : "text-text-2 hover:text-text-1",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex items-center justify-center rounded-md p-2 text-text-2 transition-colors hover:bg-surface-3 hover:text-text-1 focus-visible:outline-none focus-visible:shadow-focus md:hidden"
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        )}
      </nav>
    </header>
  );
}
