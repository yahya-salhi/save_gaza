/**
 * @typedef {object} VerifiedDotProps
 * @property {string} [label] - Label text beside the dot
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Verified status indicator — 8px green dot + neutral label.
 * NEVER render as a full green badge or background.
 *
 * @param {VerifiedDotProps} props
 */
export default function VerifiedDot({ label = "Verified", className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-full bg-verified"
        aria-hidden="true"
      />
      <span className="text-sm text-text-2">{label}</span>
    </span>
  );
}
