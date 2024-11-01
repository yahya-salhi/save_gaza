/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./Statistics.module.css";

const StatCard = ({ number, label, type }) => (
  <div className={styles.statCard}>
    <span className={styles.statNumber}>
      {number?.toLocaleString() || "N/A"}{" "}
    </span>
    <span className={styles.statLabel}>{label} </span>
    <span className={`${styles.statType} ${styles[type]}`}>{type}</span>
  </div>
);

export default function Statistics() {
  const [stats, setStats] = useState({
    total_injuries: null,
    children_deaths: null,
    women_deaths: null,
    medical_personnel_deaths: null,
    journalist_deaths: null,
    emergency_personnel_deaths: null,
    settler_attacks: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://data.techforpalestine.org/api/v2/casualties_daily.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          const latest = data[data.length - 1];
          setStats({
            total_injuries: latest.total_injuries,
            children_deaths: latest.children_deaths,
            women_deaths: latest.women_deaths,
            medical_personnel_deaths: latest.medical_personnel_deaths,
            journalist_deaths: latest.journalist_deaths,
            emergency_personnel_deaths: latest.emergency_personnel_deaths,
            settler_attacks: latest.settler_attacks,
          });
        } else {
          throw new Error("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      });
  }, []);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.statsContainer}>
      <StatCard number={stats.total_injuries} label="" type="injured" />
      <StatCard number={stats.children_deaths} label="children" type="killed" />
      <StatCard number={stats.women_deaths} label="women" type="killed" />
      <StatCard
        number={stats.medical_personnel_deaths}
        label="medical personnel"
        type="killed"
      />
      <StatCard
        number={stats.journalist_deaths}
        label="journalists"
        type="killed"
      />
      <StatCard
        number={stats.emergency_personnel_deaths}
        label="emergency personnel"
        type="killed"
      />
      <StatCard number={stats.settler_attacks} label="settler" type="attacks" />
    </div>
  );
}
