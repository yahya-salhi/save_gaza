import { Link } from "react-router-dom";

/**
 * @typedef {object} FooterProps
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Footer — section nav, source attribution, copyright. Hairline
 * border-top, muted text. Logical CSS properties for RTL readiness.
 *
 * @param {FooterProps} props
 */
export default function Footer({ className = "" }) {
  return (
    <footer
      className={[
        "border-t border-hairline px-5 py-6 text-center text-xs text-text-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <nav
        aria-label="Footer"
        className="mb-3 flex items-center justify-center gap-5"
      >
        <Link
          to="/app"
          className="text-text-2 no-underline transition-colors hover:text-text-1"
        >
          Dashboard
        </Link>
        <Link
          to="/submit"
          className="text-text-2 no-underline transition-colors hover:text-text-1"
        >
          Report
        </Link>
        <Link
          to="/login"
          className="text-text-2 no-underline transition-colors hover:text-text-1"
        >
          Admin
        </Link>
      </nav>
      <p>
        Data sourced from{" "}
        <a
          href="https://data.techforpalestine.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-2 underline transition-colors hover:text-text-1"
        >
          TechForPalestine
        </a>
      </p>
      <p className="mt-1">&copy; {new Date().getFullYear()} Save Gaza</p>
    </footer>
  );
}
