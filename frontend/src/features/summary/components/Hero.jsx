import { Link } from "react-router-dom";
import Button from "../../../shared/ui/Button.jsx";
import Skeleton from "../../../shared/ui/Skeleton.jsx";
import ErrorState from "../../../shared/ui/ErrorState.jsx";
import EmptyState from "../../../shared/ui/EmptyState.jsx";
import VerifiedDot from "../../../shared/ui/VerifiedDot.jsx";
import LiveTicker from "./LiveTicker.jsx";
import styles from "./Hero.module.css";

/**
 * @typedef {object} SummaryData
 * @property {object} gaza
 * @property {object} gaza.killed
 * @property {number} gaza.killed.total
 * @property {number} [gaza.killed.children]
 * @property {number} [gaza.killed.women]
 * @property {object} [gaza.injured]
 * @property {number} [gaza.injured.total]
 * @property {number} [gaza.reports]
 * @property {string} gaza.last_update
 * @property {object} [west_bank]
 * @property {object} [west_bank.killed]
 * @property {number} [west_bank.killed.total]
 * @property {object} [lebanon]
 * @property {object} [lebanon.killed]
 * @property {number} [lebanon.killed.total]
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
 * Format a count with en-US grouping (73,658). Falls back to "—" when
 * the value is missing so partial payloads never render "undefined".
 *
 * @param {number | undefined | null} value
 * @returns {string}
 */
function formatCount(value) {
  return typeof value === "number" ? value.toLocaleString("en-US") : "—";
}

/**
 * Hero — Observational Telemetry Monument.
 *
 * Clean, balanced, editorial hierarchy:
 * 1. Live status bar with pulse and update timestamp.
 * 2. Precision title & context.
 * 3. Monumental, clean tabular tally with subtle accent underline.
 * 4. Human cost breakdown cards with balanced padding and hairline structure.
 * 5. Multi-region secondary context.
 * 6. High-contrast, clean action buttons & verification label.
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
  const westBankTotal = summary?.west_bank?.killed?.total ?? null;
  const lebanonTotal = summary?.lebanon?.killed?.total ?? null;
  const hasScope = westBankTotal != null || lebanonTotal != null;

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.glowAura} aria-hidden="true" />

      {/* Visually hidden or clean semantic heading satisfying accessibility & tests */}
      <h1 id="hero-title" className="sr-only">
        Save Gaza
      </h1>

      {isLoading && (
        <div className={styles.stateContainer} aria-live="polite">
          <Skeleton count={3} />
        </div>
      )}

      {isError && (
        <div className={styles.stateContainer}>
          <ErrorState message={errorMessage} onRetry={onRetry} />
        </div>
      )}

      {!isLoading && !isError && !summary && (
        <div className={styles.stateContainer}>
          <EmptyState message="No casualty figures available yet." />
        </div>
      )}

      {!isLoading && !isError && summary && (
        <div className={styles.monument}>
          {/* Status badge strip */}
          <div className={styles.statusStrip}>
            <div className={styles.statusBadge}>
              <LiveTicker lastUpdate={summary.gaza.last_update} />
            </div>
            <span className={styles.statusDivider} aria-hidden="true">·</span>
            <span className={styles.statusContext}>Verified Observatory Feed</span>
          </div>

          {/* Primary Readout */}
          <div className={styles.readout}>
            <p className={styles.readoutHeading}>Palestinians Killed in Gaza</p>
            <div className={styles.tallyWrapper}>
              <p
                dir="ltr"
                className={`font-mono tabular-nums [unicode-bidi:isolate] ${styles.tally}`}
              >
                {summary.gaza.killed.total.toLocaleString("en-US")}
              </p>
            </div>
            <div className={styles.accentRule} aria-hidden="true" />
            <p className={styles.timeframe}>Documented casualties since October 7, 2023</p>
          </div>

          {/* Demographic Breakdown Cards */}
          <div
            className={styles.breakdownGrid}
            role="list"
            aria-label="Casualty breakdown"
          >
            <div className={styles.breakdownCard} role="listitem">
              <span className={styles.breakdownLabel}>Children Killed</span>
              <span
                dir="ltr"
                className={`font-mono tabular-nums [unicode-bidi:isolate] ${styles.breakdownValue}`}
              >
                {formatCount(summary.gaza.killed.children)}
              </span>
            </div>

            <div className={styles.breakdownCard} role="listitem">
              <span className={styles.breakdownLabel}>Women Killed</span>
              <span
                dir="ltr"
                className={`font-mono tabular-nums [unicode-bidi:isolate] ${styles.breakdownValue}`}
              >
                {formatCount(summary.gaza.killed.women)}
              </span>
            </div>

            <div className={styles.breakdownCard} role="listitem">
              <span className={styles.breakdownLabel}>Total Injured</span>
              <span
                dir="ltr"
                className={`font-mono tabular-nums [unicode-bidi:isolate] ${styles.breakdownValue}`}
              >
                {formatCount(summary.gaza.injured?.total)}
              </span>
            </div>
          </div>

          {/* Secondary scope context */}
          {hasScope && (
            <p className={styles.scopeFootnote}>
              {westBankTotal != null && (
                <>
                  <span
                    dir="ltr"
                    className={`font-mono tabular-nums [unicode-bidi:isolate] ${styles.scopeFigure}`}
                  >
                    {formatCount(westBankTotal)}
                  </span>{" "}
                  killed in the West Bank
                </>
              )}
              {westBankTotal != null && lebanonTotal != null && " · "}
              {lebanonTotal != null && (
                <>
                  <span
                    dir="ltr"
                    className={`font-mono tabular-nums [unicode-bidi:isolate] ${styles.scopeFigure}`}
                  >
                    {formatCount(lebanonTotal)}
                  </span>{" "}
                  in Lebanon
                </>
              )}
            </p>
          )}

          {/* Action links */}
          <div className={styles.actionCluster}>
            <div className={styles.buttonRow}>
              <Button asChild>
                <Link to="/app">View the data</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/app/gazaMap">Explore the map</Link>
              </Button>
            </div>

            <Link to="/submit" className={styles.reportLink}>
              Submit a verified field report
            </Link>
          </div>

          {/* Trust indicator */}
          <div className={styles.trustIndicator}>
            <VerifiedDot label="Verified from TechForPalestine open data feed" />
          </div>
        </div>
      )}
    </section>
  );
}
