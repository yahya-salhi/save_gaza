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
  { date: "2024-01-01", name: "New Y" },

  { date: "2024-03-10", name: "Ramadan" },
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
          fontSize="20"
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
  return `day  ${days} `;
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
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="report_date"
            stroke="white"
            tickFormatter={formatDate}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1a2e2e", border: "none" }}
            labelStyle={{ color: "white" }}
            itemStyle={{ color: "rgb(45, 212, 191)" }}
            formatter={(value) =>
              `${value ? value.toLocaleString() : "0"} killed`
            }
            labelFormatter={formatDate}
          />
          <Line
            type="monotone"
            dataKey="killed_cum"
            stroke="rgb(45, 212, 191)"
            strokeWidth={4}
            dot={<CustomDot />}
          />
          {selectedPoint && selectedPoint.killed_cum !== undefined && (
            <ReferenceDot
              x={selectedPoint.report_date}
              y={selectedPoint.killed_cum}
              r={8}
              fill="red"
              stroke="none"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      <div className={styles.totalKilled}>
        {selectedPoint && selectedPoint.killed_cum !== undefined
          ? `${selectedPoint.killed_cum.toLocaleString()} killed`
          : latestTotal !== null
          ? `${latestTotal.toLocaleString()} killed`
          : "Loading..."}
      </div>
    </div>
  );
}
