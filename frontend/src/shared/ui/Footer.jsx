/**
 * @typedef {object} FooterProps
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Footer — copyright, hairline border-top, muted text.
 * Logical CSS properties for RTL readiness.
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
