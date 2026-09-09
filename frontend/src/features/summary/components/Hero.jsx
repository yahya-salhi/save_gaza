import { Link } from "react-router-dom";
import Button from "../../../shared/ui/Button.jsx";
import Skeleton from "../../../shared/ui/Skeleton.jsx";
import ErrorState from "../../../shared/ui/ErrorState.jsx";
import EmptyState from "../../../shared/ui/EmptyState.jsx";
import LiveTicker from "./LiveTicker.jsx";

/**
 * @typedef {object} SummaryData
 * @property {object} gaza
 * @property {object} gaza.killed
 * @property {number} gaza.killed.total
 * @property {string} gaza.last_update
 */

/**
 * @typedef {object} HeroProps
 * @property {SummaryData | null} [summary] - Populated summary payload.
 * @property {boolean} [isLoading] - Loading state.
 * @property {boolean} [isError] - Error state.
 * @property {string} [errorMessage] - Human-readable error message.
 * @property {(() => void) | null} [onRetry] - Retry callback for error state.
 */

/**
 * Hero — landing tally block.
 *
 * Slice 2.1: built against the summary fixture and supports all four states
 * (loading / empty / error / populated). The populated tally is driven by the
 * `summary` prop; Slice 2.3 wires this to the useSummary query hook.
 *
 * Numerals are rendered LTR with mono tabular figures and bidi isolation so
 * they stay stable under Arabic RTL layout.
 *
 * @param {HeroProps} props
 */
export default function Hero({
  summary = null,
  isLoading = false,
  isError = false,
  errorMessage = "Unable to load the latest casualty figures.",
  onRetry = null,
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <h1 className="text-3xl font-black uppercase tracking-tight text-text-1">
        Save Gaza
      </h1>

      {isLoading && (
        <div className="w-full max-w-md" aria-live="polite">
          <Skeleton count={3} />
        </div>
      )}

      {isError && <ErrorState message={errorMessage} onRetry={onRetry} />}

      {!isLoading && !isError && !summary && (
        <EmptyState message="No casualty figures available yet." />
      )}

      {!isLoading && !isError && summary && (
        <div className="flex flex-col items-center gap-4">
          <LiveTicker lastUpdate={summary.gaza.last_update} />

          <p className="text-xs uppercase tracking-[0.2em] text-text-3">
            Palestinians killed in Gaza
          </p>

          <p
            dir="ltr"
            className="font-mono text-4xl font-black tabular-nums leading-none text-accent-500 [unicode-bidi:isolate]"
          >
            {summary.gaza.killed.total.toLocaleString("en-US")}
          </p>

          <div className="h-px w-24 bg-hairline" aria-hidden="true" />

          <p className="max-w-md text-sm text-text-2">
            Verified tally from the TechForPalestine casualty feed.
          </p>

          <Button asChild>
            <Link to="/app">View the data</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
