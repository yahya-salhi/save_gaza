import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCount as formatFigure } from "../../shared/format.js";
import styles from "./TimeSeriesChart.module.css";

/**
 * BreakdownTooltip — custom Recharts tooltip content owned by design
 * tokens. Same rationale as `HistoryTooltip` in TimeSeriesChart.jsx:
 * the library default renders outside the theme. Exported for unit tests.
 *
 * @param {object} props
 * @param {boolean} [props.active]
 * @param {Array<{ name?: string, value?: unknown, payload?: { fill?: string } }>} [props.payload]
 */
export function BreakdownTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const entry = payload[0];
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{entry.name}</p>
      <div className={styles.tooltipRow}>
        <span
          className={styles.legendSwatch}
          style={{ background: entry.payload?.fill }}
          aria-hidden="true"
        />
        <span dir="ltr" className={styles.tooltipValue}>
          {formatFigure(Number(entry.value))}
        </span>
      </div>
    </div>
  );
}

/**
 * DemographicPie — killed breakdown of the latest verified snapshot.
 *
 * Slices: children killed / women killed / all others killed
 * (`killed_cum` minus the two groups, floored at zero). Slice colors ride
 * the single cool-crimson ramp — green never marks data. The `asOf` date is
 * always shown: the breakdown usually predates the selected window (recent
 * upstream rows carry demographics as unverified estimates only, which the
 * backend excludes by contract). Ships with a screen-reader data table.
 * Default export for `React.lazy()`.
 *
 * @param {object} props
 * @param {{ killed_cum?: number, killed_children_cum?: number, killed_women_cum?: number }} props.latest - snapshot carrying verified demographics
 * @param {string} props.asOf - report date of `latest` (YYYY-MM-DD)
 */
export default function DemographicPie({ latest, asOf }) {
  const children = latest.killed_children_cum ?? 0;
  const women = latest.killed_women_cum ?? 0;
  const others = Math.max((latest.killed_cum ?? 0) - children - women, 0);

  const slices = [
    { name: "Children", value: children, fill: "var(--accent-500)" },
    { name: "Women", value: women, fill: "var(--accent-400)" },
    { name: "Others", value: others, fill: "var(--accent-200)" },
  ];

  return (
    <div className={styles.chartPanel}>
      <h3 className={styles.chartTitle}>Who was killed</h3>
      <p className={styles.chartSub}>
        Last verified breakdown ·{" "}
        <span dir="ltr" className="tabular-nums font-mono [unicode-bidi:isolate]">
          {asOf}
        </span>
      </p>
      <div className={styles.chartCanvas} role="img" aria-label={`Demographic breakdown as of ${asOf}: ${formatFigure(children)} children, ${formatFigure(women)} women, ${formatFigure(others)} others`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<BreakdownTooltip />} />
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="85%"
              strokeWidth={0}
            >
              {slices.map((slice) => (
                <Cell key={slice.name} fill={slice.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className={styles.legend}>
        {slices.map((slice) => (
          <li key={slice.name} className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ background: slice.fill }} />
            {slice.name}
            <span dir="ltr" className={styles.legendValue}>
              {formatFigure(slice.value)}
            </span>
          </li>
        ))}
      </ul>
      <table className={styles.srOnly}>
        <caption>Demographic breakdown of total killed</caption>
        <tbody>
          {slices.map((slice) => (
            <tr key={slice.name}>
              <th scope="row">{slice.name}</th>
              <td>{slice.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
