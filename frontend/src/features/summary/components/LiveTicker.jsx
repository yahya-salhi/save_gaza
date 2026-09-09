import styles from "./LiveTicker.module.css";

/**
 * @typedef {object} LiveTickerProps
 * @property {string | null} [lastUpdate] - Upstream `last_update` date (YYYY-MM-DD).
 * @property {string} [label] - Leading label before the timestamp.
 */

/**
 * LiveTicker — pulsing live indicator with a mono timestamp.
 *
 * Rendered inside `Hero` on the populated path only; loading / empty /
 * error states are owned by the parent. The pulse is disabled under
 * `prefers-reduced-motion` (see module CSS). Timestamps keep LTR order
 * with mono tabular figures under RTL layout.
 *
 * @param {LiveTickerProps} props
 */
export default function LiveTicker({ lastUpdate = null, label = "Live" }) {
  return (
    <span aria-live="polite" className={styles.ticker}>
      <span aria-hidden="true" className={styles.dot} />
      <span className={styles.text}>
        {label}
        {lastUpdate && (
          <>
            {" — updated "}
            <span dir="ltr" className={styles.date}>
              {lastUpdate}
            </span>
          </>
        )}
      </span>
    </span>
  );
}
