/**
 * @typedef {object} ErrorStateProps
 * @property {string} [message] - Error message to display
 * @property {(() => void) | null} [onRetry] - Retry callback
 * @property {string} [className] - Additional CSS classes
 */

import Button from "./Button.jsx";

/**
 * Error state — human-readable message with retry trigger.
 * Uses --danger (accent-500) for the icon accent, neutral text for the message.
 *
 * @param {ErrorStateProps} props
 */
export default function ErrorState({
  message = "Something went wrong",
  onRetry = null,
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
      <span
        className="inline-block h-3 w-3 rounded-full bg-danger"
        aria-hidden="true"
      />
      <p className="text-text-2 text-sm">{message}</p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
