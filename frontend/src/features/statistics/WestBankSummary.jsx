import { useWestBankDaily } from "./hooks/useWestBankDaily.js";
import styles from "./GazaSummary.module.css";

/**
 * WestBankSummary — field tally for the latest West Bank snapshot.
 *
 * Same tally-card language as GazaSummary (shared CSS Module): massive
 * cumulative tally → contextual breakdown → metadata. No per-report delta —
 * the v2 feed carries cumulative counters only. No arrests data exists
 * upstream, so arrests are out of scope.
 */

/**
 * Format a figure with US grouping so rendering is identical in every
 * browser locale (bare toLocaleString() yields "1 114" under fr-FR).
 * @param {number} n
 */
function formatFigure(n) {
  return n.toLocaleString("en-US");
}

export function WestBankSummary() {
  const { data, isLoading, isError, error } = useWestBankDaily();

  if (isLoading) {
    return (
      <div className={styles.card} aria-busy="true" aria-label="Loading West Bank statistics">
        <div className={styles.skeletonTally} />
        <div className={styles.skeletonDelta} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.card} role="alert">
        <p className={styles.error}>
          {error?.message ?? "Failed to load West Bank statistics"}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>No West Bank data available yet</p>
      </div>
    );
  }

  const killed = data.killed_cum ?? 0;
  const injured = data.injured_cum ?? 0;

  const breakdown = [
    { label: "Children killed", value: data.killed_children_cum },
    { label: "Children injured", value: data.injured_children_cum },
    { label: "Settler attacks", value: data.settler_attacks_cum },
    { label: "Displaced households", value: data.displaced_households_cum },
    { label: "Displaced persons", value: data.displaced_persons_cum },
    { label: "Displaced children", value: data.displaced_children_cum },
  ].filter(
    (row) => row.value !== undefined && row.value !== null,
  );

  return (
    <div className={styles.card} aria-label="West Bank daily statistics">
      <div className={styles.severityBar} aria-hidden="true" />

      <div className={styles.tally}>
        <div className={styles.tallyCell}>
          <span
            dir="ltr"
            className={`${styles.tallyNumber} ${styles.tallyKilled}`}
          >
            {formatFigure(killed)}
          </span>
          <span className={styles.tallyLabel}>killed</span>
        </div>
        <div className={styles.tallyDivider} aria-hidden="true" />
        <div className={styles.tallyCell}>
          <span
            dir="ltr"
            className={`${styles.tallyNumber} ${styles.tallyInjured}`}
          >
            {formatFigure(injured)}
          </span>
          <span className={styles.tallyLabel}>injured</span>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div className={styles.contextGrid}>
          {breakdown.map((row) => (
            <div key={row.label} className={styles.contextRow}>
              <span className={styles.contextLabel}>{row.label}</span>
              <span dir="ltr" className={styles.contextValue}>
                {formatFigure(row.value ?? 0)}
              </span>
            </div>
          ))}
        </div>
      )}

      <footer className={styles.meta}>
        <span>West Bank</span>
        <span className={styles.metaDot} aria-hidden="true" />
        <span>{data.report_date}</span>
      </footer>
    </div>
  );
}
