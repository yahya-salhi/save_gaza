import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCount } from "../../shared/format.js";
import styles from "./TimeSeriesChart.module.css";

/**
 * Compact axis formatter: 73000 → "73k".
 * @param {number} value
 */
function compact(value) {
  if (typeof value !== "number") return value;
  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 100) / 10}k`;
  }
  return String(value);
}

/**
 * Full grouped figure for tooltip values: 73662 → "73,662".
 * @param {unknown} value
 */
function formatFull(value) {
  return formatCount(Number(value));
}

/**
 * HistoryTooltip — custom Recharts tooltip content owned by design tokens.
 *
 * The library default tooltip chrome renders outside the theme (dark text
 * on live values); this replaces it with an obsidian panel, muted label,
 * series swatch, and mono tabular value. Exported for unit tests — charts
 * cannot be hovered in jsdom.
 *
 * @param {object} props
 * @param {boolean} [props.active]
 * @param {Array<{ dataKey?: string, name?: string, value?: unknown, color?: string }>} [props.payload]
 * @param {string} [props.label]
 */
export function HistoryTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>Report {label}</p>
      {payload.map((entry) => (
        <div
          key={entry.dataKey ?? entry.name}
          className={styles.tooltipRow}
        >
          <span
            className={styles.legendSwatch}
            style={{ background: entry.color }}
            aria-hidden="true"
          />
          <span className={styles.tooltipName}>{entry.name}</span>
          <span dir="ltr" className={styles.tooltipValue}>
            {formatFull(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * TimeSeriesChart — cumulative killed / injured line chart.
 *
 * Plots the stored cumulative counters exactly as persisted (no backend
 * delta computation). Ships with a screen-reader data table so the series
 * values are assertable and accessible without reading SVG internals.
 * Default export for `React.lazy()` code-splitting.
 *
 * @param {object} props
 * @param {Array<{ report_date: string, killed_cum?: number, injured_cum?: number }>} props.items - ascending daily snapshots
 */
export default function TimeSeriesChart({ items }) {
  return (
    <div className={styles.chartPanel}>
      <h3 className={styles.chartTitle}>Casualties over time</h3>
      <div className={styles.chartCanvas} role="img" aria-label="Line chart of cumulative killed and injured over the selected period">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={items} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--hairline)" vertical={false} />
            <XAxis
              dataKey="report_date"
              tickFormatter={(date) => String(date).slice(5)}
              tick={{ fill: "var(--text-3)", fontSize: 12 }}
              axisLine={{ stroke: "var(--hairline-strong)" }}
              tickLine={false}
              minTickGap={32}
            />
            <YAxis
              tickFormatter={compact}
              tick={{ fill: "var(--text-3)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              content={<HistoryTooltip />}
              cursor={{ stroke: "var(--hairline-strong)" }}
            />
            <Line
              type="monotone"
              dataKey="killed_cum"
              name="Killed"
              stroke="var(--accent-500)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="injured_cum"
              name="Injured"
              stroke="var(--accent-300)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ul className={styles.legend} aria-hidden="true">
        <li className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ background: "var(--accent-500)" }} />
          Killed
        </li>
        <li className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ background: "var(--accent-300)" }} />
          Injured
        </li>
      </ul>
      <table className={styles.srOnly}>
        <caption>Cumulative killed and injured per report date</caption>
        <thead>
          <tr>
            <th scope="col">Report date</th>
            <th scope="col">Killed (cumulative)</th>
            <th scope="col">Injured (cumulative)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((day) => (
            <tr key={day.report_date}>
              <th scope="row">{day.report_date}</th>
              <td>{day.killed_cum ?? "—"}</td>
              <td>{day.injured_cum ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
