/* eslint-disable react/prop-types */
import { useMemo } from "react";
import {
  FaChild,
  FaUserMd,
  FaUserShield,
  FaFemale,
  FaNewspaper,
  FaAmbulance,
  FaHeartBroken,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./GazaSummary.module.css";

function StatisticItem({ icon: Icon, value, label, to }) {
  const Component = to ? Link : "div";

  return (
    <Component className={styles.statisticItem} {...(to && { to: `${to}` })}>
      <Icon className={styles.icon} />
      <div className={styles.statisticContent}>
        <span className={styles.statisticValue}>{value}</span>
        <span className={styles.statisticLabel}>{label}</span>
      </div>
    </Component>
  );
}

function GazaSummary({ gaza, isLoading }) {
  const statistics = useMemo(() => {
    if (!gaza || !gaza.killed || !gaza.injured) return [];

    return [
      {
        icon: FaUserShield,
        value: gaza.massacres,
        label: "Massacres",
        to: `${gaza.massacres}`,
      },
      {
        icon: FaHeartBroken,
        value: gaza.killed.total,
        label: "Total Killed",
        to: `${gaza.killed.total}`,
      },
      {
        icon: FaChild,
        value: gaza.killed.children,
        label: "Children Killed",
        to: `${gaza.killed.children}`,
      },
      {
        icon: FaFemale,
        value: gaza.killed.women,
        label: "Women Killed",
      },
      {
        icon: FaUserShield,
        value: gaza.killed.civil_defence,
        label: "Civil Defense Killed",
      },
      {
        icon: FaNewspaper,
        value: gaza.killed.press,
        label: "Press Killed",
      },
      {
        icon: FaUserMd,
        value: gaza.killed.medical,
        label: "Medical Staff Killed",
      },
      {
        icon: FaAmbulance,
        value: gaza.injured.total,
        label: "Total Injured",
      },
    ];
  }, [gaza]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!gaza || !gaza.killed || !gaza.injured) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>No data available</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statisticsGrid}>
        {statistics.map((stat, index) => (
          <StatisticItem
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            to={stat.to}
          />
        ))}
      </div>
    </div>
  );
}

export default GazaSummary;
