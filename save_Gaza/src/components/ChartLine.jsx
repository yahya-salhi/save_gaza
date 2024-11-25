/* eslint-disable react/prop-types */
import { useMemo } from "react";
import {
  Line,
  LineChart,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import styles from "./ChartLine.module.css";

const events = [
  { date: "2024-01-01", name: "New Year" },
  { date: "2024-03-10", name: "Ramadan" },
  { date: "2024-04-01", name: "Rafah Attack" },
];

const CustomDot = ({ cx, cy, payload }) => {
  const event = events.find((e) => e.date === payload.report_date);
  if (event) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill="var(--color-light--1)" />
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fill="var(--color-light--1)"
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

const formatDate = (date) => {
  const days = Math.floor(
    (new Date(date).getTime() - new Date("2023-10-07").getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return `Day ${days}`;
};

export default function ChartLine({ data, selectedDate }) {
  const latestTotal = useMemo(() => {
    return data.length > 0 ? data[data.length - 1].killed_cum : null;
  }, [data]);

  const selectedPoint = useMemo(() => {
    if (!selectedDate) return null;
    return data.find((item) => item.report_date === selectedDate);
  }, [data, selectedDate]);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Cumulative Casualties Over Time</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-dark--2)" />
          <XAxis
            dataKey="report_date"
            stroke="var(--color-light--2)"
            tickFormatter={formatDate}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-dark--1)",
              border: "none",
              borderRadius: "var(--border-radius)",
            }}
            labelStyle={{ color: "var(--color-light--1)" }}
            itemStyle={{ color: "var(--color-brand--2)" }}
            formatter={(value) =>
              `${value ? value.toLocaleString() : "0"} casualties`
            }
            labelFormatter={formatDate}
          />
          <Line
            type="monotone"
            dataKey="killed_cum"
            stroke="var(--color-brand--2)"
            strokeWidth={3}
            dot={<CustomDot />}
          />
          {selectedPoint && selectedPoint.killed_cum !== undefined && (
            <ReferenceDot
              x={selectedPoint.report_date}
              y={selectedPoint.killed_cum}
              r={8}
              fill="var(--color-brand--1)"
              stroke="none"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      <div className={styles.totalKilled}>
        {selectedPoint && selectedPoint.killed_cum !== undefined
          ? `${selectedPoint.killed_cum.toLocaleString()} casualties`
          : latestTotal !== null
          ? `${latestTotal.toLocaleString()} casualties`
          : "Loading..."}
      </div>
    </div>
  );
}
