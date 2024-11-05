/* eslint-disable react/prop-types */
import { useMemo } from "react";
import styles from "./PieChart.module.css";

function Circle({ percentage, label }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const safePercentage = isNaN(percentage)
    ? 0
    : Math.min(Math.max(percentage, 0), 100);
  const strokeDasharray = ((100 - safePercentage) / 100) * circumference;

  return (
    <div className={styles.circleWrapper}>
      <svg viewBox="0 0 200 200" className={styles.circle}>
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="rgb(38, 38, 38)"
          strokeWidth="20"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="rgb(45, 212, 191)"
          strokeWidth="20"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${strokeDasharray}`}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div className={styles.percentageText}>{safePercentage}%</div>
      <div className={styles.labelText}>were {label}</div>
    </div>
  );
}

function PieChart({ data }) {
  const percentages = useMemo(() => {
    const total = data?.killed_cum || 0;
    const children = data?.ext_killed_children_cum || 0;
    const women = data?.ext_killed_women_cum || 0;

    if (total === 0) {
      return { children: 0, women: 0 };
    }

    return {
      children: Math.round((children / total) * 100),
      women: Math.round((women / total) * 100),
    };
  }, [data]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Of those killed:</h2>
      <div className={styles.chartsContainer}>
        <Circle percentage={percentages.children} label="children" />
        <Circle percentage={percentages.women} label="women" />
      </div>
      <div className={styles.dashboard}>
        Use the slider above to see the human impact over time. These counts are
        part of a wider picture of suffering, and do not include the many who
        succumb to disease, famine, and the knock-on effects of mass destruction
      </div>
    </div>
  );
}

export default PieChart;
