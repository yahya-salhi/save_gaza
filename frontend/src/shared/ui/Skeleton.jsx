/**
 * @typedef {object} SkeletonProps
 * @property {number} [count] - Number of skeleton lines
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Loading placeholder — pulsing surface rectangles.
 * Renders `count` skeleton lines to approximate content shape.
 *
 * @param {SkeletonProps} props
 */
export default function Skeleton({ count = 3, className = "" }) {
  return (
    <div
      className={["flex flex-col gap-3", className].filter(Boolean).join(" ")}
      aria-busy="true"
      aria-label="Loading"
      role="status"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="h-4 w-full animate-pulse rounded bg-surface-2"
          style={{
            width: i === count - 1 ? "60%" : "100%",
          }}
        />
      ))}
    </div>
  );
}
