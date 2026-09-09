import { Link } from "react-router-dom";

/**
 * @typedef {object} NavbarProps
 * @property {(() => void) | null} [onMenuToggle] - Callback when hamburger menu is clicked
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Top navigation bar — logo, nav links, hamburger toggle for mobile sidebar.
 * Uses backdrop blur on scroll, logical CSS properties for RTL.
 *
 * @param {NavbarProps} props
 */
export default function Navbar({ onMenuToggle = null, className = "" }) {
  return (
    <header
      className={[
        "sticky top-0 z-40 flex items-center justify-between border-b border-hairline px-5 py-3",
        "bg-bg/95 backdrop-blur",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link
        to="/"
        className="font-display text-lg font-bold tracking-wide text-text-1 no-underline"
      >
        Save Gaza
      </Link>

      <nav className="flex items-center gap-4">
        <Link
          to="/app"
          className="text-sm text-text-2 no-underline transition-colors hover:text-text-1"
        >
          Dashboard
        </Link>
        <Link
          to="/submit"
          className="text-sm text-text-2 no-underline transition-colors hover:text-text-1"
        >
          Report
        </Link>

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
