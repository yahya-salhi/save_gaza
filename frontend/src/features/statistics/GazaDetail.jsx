import { useGazaDaily } from "./hooks/useGazaDaily.js";
import styles from "./GazaSummary.module.css";

/**
 * GazaDetail — the rest of the Gaza record below the headline tally.
 *
 * GazaSummary (overview) owns the killed/injured tally, per-report delta,
 * and core breakdown. This section renders every remaining verified field
 * from the same `useGazaDaily` query (shared cache, no second fetch):
 * truce & committee counts, starvation deaths, and aid-seeker casualties.
 * Groups with no upstream values are omitted.
 *
 * State ownership: GazaSummary owns the page-level loading/error/empty
 * states, so this section renders a skeleton while loading and nothing on
 * error or empty — avoiding duplicate alerts on the page.
 */

/**
 * Format a figure with US grouping so rendering is identical in every
 * browser locale (bare toLocaleString() yields "73 669" under fr-FR).
 * @param {number} n
 */
function formatFigure(n) {
  return n.toLocaleString("en-US");
}

/** @type {Array<{ title: string, rows: Array<{ label: string, key: string }> }>} */
const GROUPS = [
  {
    title: "Truce & committee",
    rows: [
      { label: "Recovered bodies", key: "killed_recovered" },
      { label: "Succumbed to injuries", key: "killed_succumbed" },
      { label: "Killed since 2025 truce", key: "killed_truce_new" },
      { label: "Recognized by committee", key: "killed_committee" },
    ],
  },
  {
    title: "Starvation",
    rows: [
      { label: "Children killed by starvation", key: "child_famine_cum" },
      { label: "Killed by starvation", key: "famine_cum" },
    ],
  },
  {
    title: "Aid seekers",
    rows: [
      { label: "Aid seekers killed", key: "aid_seeker_killed_cum" },
      { label: "Aid seekers injured", key: "aid_seeker_injured_cum" },
    ],
  },
];

export function GazaDetail() {
  const { data, isLoading, isError } = useGazaDaily();

  if (isLoading) {
    return (
      <div className={styles.card} aria-busy="true" aria-label="Loading full Gaza record">
        <div className={styles.skeletonTally} />
        <div className={styles.skeletonDelta} />
      </div>
    );
  }

  if (isError || !data) {
    return null;
  }

  // Dynamic metric lookup — every GROUPS key is a numeric field by construction.
  const metrics = /** @type {Object.<string, *>} */ (data);

  const groups = GROUPS.map((group) => ({
    title: group.title,
    rows: group.rows.filter((row) => {
      const value = metrics[row.key];
      return value !== undefined && value !== null;
    }),
  })).filter((group) => group.rows.length > 0);

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className={styles.card} aria-label="Full Gaza record">
      {groups.map((group) => (
        <section key={group.title} aria-label={group.title}>
          <p className={styles.deltaLabel}>{group.title}</p>
          <div className={styles.contextGrid}>
            {group.rows.map((row) => (
              <div key={row.label} className={styles.contextRow}>
                <span className={styles.contextLabel}>{row.label}</span>
                <span dir="ltr" className={styles.contextValue}>
                  {formatFigure(metrics[row.key] ?? 0)}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
