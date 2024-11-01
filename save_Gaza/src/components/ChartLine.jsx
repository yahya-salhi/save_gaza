import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./ChartLine.module.css";

const events = [
  { date: "2023-11-23", name: "Thanksgiving" },
  { date: "2024-01-01", name: "NYE" },
  { date: "2024-01-26", name: "ICJ Ruling" },
  { date: "2024-03-10", name: "Ramadan" },
  { date: "2024-03-31", name: "Easter" },
  { date: "2024-04-01", name: "Rafah Attack" },
];

const CustomDot = ({ cx, cy, payload }) => {
  const event = events.find((e) => e.date === payload.report_date);
  if (event) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill="white" />
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fill="white"
          fontSize="12"
          className={styles.chartLabel}
        >
          {event.name}
        </text>
      </g>
    );
  }
  return null;
};

export default function ChartLine({ data }) {
  // Calculate the latest total of 'killed' from the data
  const latestTotal = data.length > 0 ? data[data.length - 1].killed_cum : null;

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="report_date"
            stroke="white"
            tickFormatter={(date) => {
              const days = Math.floor(
                (new Date(date).getTime() - new Date("2023-10-07").getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return `Day ${days}`;
            }}
          />
          <YAxis
            stroke="white"
            label={{
              value: "Deaths",
              angle: -90,
              position: "insideLeft",
              fill: "white",
            }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1a2e2e", border: "none" }}
            labelStyle={{ color: "white" }}
            itemStyle={{ color: "rgb(45, 212, 191)" }}
            formatter={(value) => `${value.toLocaleString()} killed`}
          />
          <Line
            type="monotone"
            dataKey="killed_cum"
            stroke="rgb(45, 212, 191)"
            strokeWidth={2}
            dot={<CustomDot />}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className={styles.totalKilled}>
        {latestTotal ? `${latestTotal.toLocaleString()} killed` : "Loading..."}
      </div>
    </div>
  );
}
