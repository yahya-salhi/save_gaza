import styles from "./TimeSeriesChart.module.css";

/**
 * Earliest report date in the upstream v2 feeds. Used as the "All" preset
 * floor so the slider never queries before data exists.
 */
export const EARLIEST_REPORT_DATE = "2023-10-07";

/**
 * DateRangeSlider — window control for the history analytics section.
 *
 * Two native date inputs plus 30-day / 90-day / All presets. Presentational
 * only: the parent owns the values (URL search params) and receives the
 * corrected range via `onRangeChange`. Inverted ranges are auto-corrected
 * by pinning the edited bound.
 *
 * @param {object} props
 * @param {string} props.startDate - YYYY-MM-DD window start
 * @param {string} props.endDate - YYYY-MM-DD window end
 * @param {string} props.min - earliest selectable date (YYYY-MM-DD)
 * @param {string} props.max - latest selectable date (YYYY-MM-DD)
 * @param {(range: { startDate: string, endDate: string }) => void} props.onRangeChange
 */
export function DateRangeSlider({ startDate, endDate, min, max, onRangeChange }) {
  /**
   * @param {string} value - YYYY-MM-DD from the start input
   */
  function handleStart(value) {
    if (!value) return;
    onRangeChange({
      startDate: value,
      endDate: value > endDate ? value : endDate,
    });
  }

  /**
   * @param {string} value - YYYY-MM-DD from the end input
   */
  function handleEnd(value) {
    if (!value) return;
    onRangeChange({
      startDate: value < startDate ? value : startDate,
      endDate: value,
    });
  }

  /**
   * @param {number} days - trailing window size for the preset
   */
  function preset(days) {
    onRangeChange({ startDate: shiftDate(max, -days), endDate: max });
  }

  function presetAll() {
    onRangeChange({ startDate: min, endDate: max });
  }

  const activePreset =
    endDate === max
      ? startDate === shiftDate(max, -30)
        ? "30"
        : startDate === shiftDate(max, -90)
          ? "90"
          : startDate === min
            ? "all"
            : null
      : null;

  return (
    <div className={styles.controls} role="group" aria-label="Date range">
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="history-start">
          From
        </label>
        <input
          id="history-start"
          type="date"
          className={styles.dateInput}
          value={startDate}
          min={min}
          max={endDate}
          onChange={(event) => handleStart(event.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="history-end">
          To
        </label>
        <input
          id="history-end"
          type="date"
          className={styles.dateInput}
          value={endDate}
          min={startDate}
          max={max}
          onChange={(event) => handleEnd(event.target.value)}
        />
      </div>
      <div className={styles.presets} role="group" aria-label="Quick ranges">
        <button
          type="button"
          className={`${styles.preset} ${activePreset === "30" ? styles.presetActive : ""}`}
          aria-pressed={activePreset === "30"}
          onClick={() => preset(30)}
        >
          30d
        </button>
        <button
          type="button"
          className={`${styles.preset} ${activePreset === "90" ? styles.presetActive : ""}`}
          aria-pressed={activePreset === "90"}
          onClick={() => preset(90)}
        >
          90d
        </button>
        <button
          type="button"
          className={`${styles.preset} ${activePreset === "all" ? styles.presetActive : ""}`}
          aria-pressed={activePreset === "all"}
          onClick={presetAll}
        >
          All
        </button>
      </div>
    </div>
  );
}

/**
 * Shift a YYYY-MM-DD date by `days` (UTC), returning YYYY-MM-DD.
 * @param {string} dateStr
 * @param {number} days
 */
export function shiftDate(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
