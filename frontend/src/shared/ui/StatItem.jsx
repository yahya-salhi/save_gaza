/**
 * @typedef {object} StatItemProps
 * @property {import('react').ReactNode} [icon] - Optional icon element
 * @property {number | string} value - The stat value
 * @property {string} label - Descriptive label
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Stat card — icon + mono figure + label on nested surface.
 * Figures use tabular-nums mono with bidi isolation for RTL safety.
 *
 * @param {StatItemProps} props
 */
export default function StatItem({ icon = null, value, label, className = "" }) {
  return (
    <div
      className={[
        "flex items-center gap-4 rounded-md bg-surface-2 p-4 transition-[background-color,transform] duration-150 hover:bg-surface-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <span className="text-accent-400 text-lg shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <span
          dir="ltr"
          className="font-mono text-xl font-medium tabular-nums text-text-1 [unicode-bidi:isolate]"
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        <span className="text-xs text-text-3 truncate">{label}</span>
      </div>
    </div>
  );
}
