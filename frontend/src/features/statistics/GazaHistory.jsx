import { Suspense, lazy, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useHistory } from "./hooks/useHistory.js";
import { DateRangeSlider, EARLIEST_REPORT_DATE, shiftDate } from "./DateRangeSlider.jsx";
import Button from "../../shared/ui/Button.jsx";
import { downloadHistoryExport } from "./export.js";
import styles from "./TimeSeriesChart.module.css";

const TimeSeriesChart = lazy(() => import("./TimeSeriesChart.jsx"));
const DemographicPie = lazy(() => import("./DemographicPie.jsx"));

/** Trailing window (days) served when the URL carries no explicit range. */
const DEFAULT_WINDOW_DAYS = 90;

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * A day carries a verified demographic breakdown when it holds at least one
 * of the verified children/women counters. Recent upstream rows carry
 * demographics as `ext_*` estimates only — excluded by the backend by
 * contract — so most recent windows have none at all.
 *
 * @param {{ killed_children_cum?: number, killed_women_cum?: number } | null | undefined} day
 */
export function hasDemographics(day) {
  return (
    day != null &&
    (day.killed_children_cum !== undefined ||
      day.killed_women_cum !== undefined)
  );
}

/**
 * Last item in `items` carrying verified demographics, or null.
 * @param {Array<{ report_date: string, killed_cum?: number, killed_children_cum?: number, killed_women_cum?: number }>} items - ascending daily snapshots
 */
function findLastWithDemographics(items) {
  for (let i = items.length - 1; i >= 0; i--) {
    if (hasDemographics(items[i])) {
      return items[i];
    }
  }
  return null;
}

/**
 * GazaHistory — time-series analytics section at the bottom of `/app/gaza`.
 *
 * Owns the `?startDate=&endDate=` URL params (shareable windows), fetches
 * the whole window in one `useHistory` query, and renders the slider plus
 * lazily-loaded Recharts line + pie. `GazaSummary` owns the page-level
 * loading/error/empty states, so this section renders a skeleton while its
 * first load is pending and nothing on error or empty — mirroring
 * `GazaDetail` and keeping the single-alert invariant on the page.
 *
 * Demographics note: the pie needs verified children/women counters, which
 * recent upstream rows omit (estimates only, excluded by contract). When
 * the window has none, a fallback query over the full pre-window history
 * supplies the last verified breakdown, prominently dated — instead of an
 * empty circle of zeroes.
 */
export function GazaHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = todayUTC();
  const defaultStart = shiftDate(today, -DEFAULT_WINDOW_DAYS);

  const startDate = searchParams.get("startDate") ?? defaultStart;
  const endDate = searchParams.get("endDate") ?? today;

  const { data, isLoading } = useHistory({ startDate, endDate });
  const items = Array.isArray(data?.items) ? data.items : [];
  const [downloading, setDownloading] = useState(
    /** @type {"csv" | "json" | null} */ (null),
  );
  const [exportError, setExportError] = useState(
    /** @type {string | null} */ (null),
  );

  /**
   * @param {"csv" | "json"} format
   */
  async function handleExport(format) {
    setExportError(null);
    setDownloading(format);
    try {
      await downloadHistoryExport({ startDate, endDate, format });
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(null);
    }
  }

  const inWindowLatest = findLastWithDemographics(items);
  const needFallback = data != null && inWindowLatest == null;
  const fallback = useHistory(
    { startDate: EARLIEST_REPORT_DATE, endDate: startDate, limit: 1000 },
    { enabled: needFallback, refetchInterval: false },
  );
  const fallbackItems = Array.isArray(fallback.data?.items)
    ? fallback.data.items
    : [];
  const pieLatest = inWindowLatest ?? findLastWithDemographics(fallbackItems);

  /**
   * @param {{ startDate: string, endDate: string }} range
   */
  function handleRangeChange(range) {
    setSearchParams({ startDate: range.startDate, endDate: range.endDate });
  }

  if (isLoading && items.length === 0) {
    return (
      <div className={styles.card} aria-busy="true" aria-label="Loading casualty trends">
        <span className={styles.severityBar} aria-hidden="true" />
        <div className={styles.skeletonChart} />
      </div>
    );
  }

  if (!data || items.length === 0) {
    return null;
  }

  const showFallbackLoading = pieLatest == null && fallback.isLoading;

  return (
    <section className={styles.card} aria-label="Gaza casualty trends">
      <span className={styles.severityBar} aria-hidden="true" />
      <div>
        <h2 className={styles.sectionTitle}>Trends</h2>
        <p className={styles.sectionCopy}>
          Cumulative casualties across the selected reporting window. The
          breakdown shows the last verified demographics, dated on the chart.
        </p>
      </div>
      <DateRangeSlider
        startDate={startDate}
        endDate={endDate}
        min={EARLIEST_REPORT_DATE}
        max={today}
        onRangeChange={handleRangeChange}
      />
      <div className={styles.exportRow}>
        <Button
          type="button"
          variant="ghost"
          disabled={isLoading || downloading !== null}
          onClick={() => handleExport("csv")}
        >
          {downloading === "csv" ? "Saving…" : "Download CSV"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isLoading || downloading !== null}
          onClick={() => handleExport("json")}
        >
          {downloading === "json" ? "Saving…" : "Download JSON"}
        </Button>
        {exportError ? (
          <p role="status" className={styles.exportError}>
            {exportError}
          </p>
        ) : null}
      </div>
      <div className={styles.chartGrid}>
        <Suspense
          fallback={
            <div className={styles.skeletonChart} aria-label="Loading charts" />
          }
        >
          <TimeSeriesChart items={items} />
          {pieLatest != null ? (
            <DemographicPie latest={pieLatest} asOf={pieLatest.report_date} />
          ) : showFallbackLoading ? (
            <div className={styles.skeletonChart} aria-label="Loading breakdown" />
          ) : (
            <div className={styles.chartPanel}>
              <h3 className={styles.chartTitle}>Who was killed</h3>
              <p className={styles.sectionCopy}>
                No verified demographic breakdown on record for this
                selection. Recent reports carry demographics as unverified
                estimates only, which this dashboard excludes.
              </p>
            </div>
          )}
        </Suspense>
      </div>
      <p className={styles.meta}>
        Showing
        <span dir="ltr" className="tabular-nums font-mono [unicode-bidi:isolate]">
          {items.length} of {data.total}
        </span>
        daily reports
      </p>
    </section>
  );
}
