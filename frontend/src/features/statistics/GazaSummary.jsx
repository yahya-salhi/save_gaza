import { useGazaDaily } from "./hooks/useGazaDaily.js";
import styles from "./GazaSummary.module.css";

/**
 * GazaSummary — field tally for the latest Gaza daily snapshot.
 *
 * Hierarchy: massive cumulative tally → per-report delta → contextual breakdown → metadata.
 * No icons — the numbers speak for themselves.
 */

/** Upstream source codes mapped to display labels. @type {Record<string, string>} */
const SOURCE_LABELS = {
  mohtel: "MoH",
  moh: "MoH",
  gmo: "GMO",
};

/**
 * Format a figure with US grouping so rendering is identical in every
 * browser locale (bare toLocaleString() yields "73 669" under fr-FR).
 * @param {number} n
 */
function formatFigure(n) {
  return n.toLocaleString("en-US");
}

/**
 * @param {unknown} source
 */
function formatSource(source) {
  const key = String(source ?? "").toLowerCase();
  return SOURCE_LABELS[key] ?? String(source ?? "");
}

export function GazaSummary() {
  const { data, isLoading, isError, error } = useGazaDaily();

  if (isLoading) {
    return (
      <div className={styles.card} aria-busy="true" aria-label="Loading Gaza statistics">
        <div className={styles.skeletonTally} />
        <div className={styles.skeletonDelta} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.card} role="alert">
        <p className={styles.error}>
          {error?.message ?? "Failed to load Gaza statistics"}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.card}>
        <p className={styles.empty}>No Gaza data available yet</p>
      </div>
    );
  }

  const killed = data.killed_cum ?? 0;
  const injured = data.injured_cum ?? 0;
  const killedToday = data.killed ?? 0;
  const injuredToday = data.injured ?? 0;

  const breakdown = [
    { label: "Children killed", value: data.killed_children_cum },
    { label: "Women killed", value: data.killed_women_cum },
    { label: "Press killed", value: data.press_killed_cum },
    { label: "Medical killed", value: data.med_killed_cum },
    { label: "Civil defence killed", value: data.civdef_killed_cum },
    { label: "Massacres", value: data.massacres_cum },
  ].filter(
    (row) => row.value !== undefined && row.value !== null,
  );

  return (
    <div className={styles.card} aria-label="Gaza daily statistics">
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

      {(killedToday > 0 || injuredToday > 0) && (
        <div className={styles.delta}>
          <span className={styles.deltaLabel}>This report</span>
          <span className={styles.deltaNumbers}>
            {killedToday > 0 && (
              <span className={styles.deltaItem}>
                <span dir="ltr" className={styles.deltaValue}>{formatFigure(killedToday)}</span>
                <span className={styles.deltaWord}>killed</span>
              </span>
            )}
            {injuredToday > 0 && (
              <span className={styles.deltaItem}>
                <span dir="ltr" className={styles.deltaValue}>{formatFigure(injuredToday)}</span>
                <span className={styles.deltaWord}>injured</span>
              </span>
            )}
          </span>
        </div>
      )}

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
        <span>{formatSource(data.report_source)}</span>
        <span className={styles.metaDot} aria-hidden="true" />
        <span>{data.report_date}</span>
        <span className={styles.metaDot} aria-hidden="true" />
        <span>{data.report_period}h reporting window</span>
      </footer>
    </div>
  );
}
