/**
 * @typedef {object} EmptyStateProps
 * @property {string} [message] - Empty state message
 * @property {import('react').ReactNode} [action] - Optional action slot
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Neutral empty state — shown when data array is empty or absent.
 * Uses muted text color and optional action slot.
 *
 * @param {EmptyStateProps} props
 */
export default function EmptyState({
  message = "No data available",
  action = null,
  className = "",
}) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-text-3 text-sm">{message}</p>
      {action}
    </div>
  );
}
