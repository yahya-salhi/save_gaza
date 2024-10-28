/* eslint-disable react/prop-types */
import styles from "./GazaSummary.module.css"; // Import the CSS module

function GazaSummary({ gaza, isLoading }) {
  if (isLoading) return <p>Loading...</p>;
  if (!gaza || !gaza.killed || !gaza.injured) return <p>No data available</p>;

  const { massacres, killed, injured } = gaza;

  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.statisticItem}>
        <span className={styles.statisticValue}>{massacres}</span>
        <span className={styles.statisticLabel}>Massacres</span>
      </div>
      <div className={styles.statisticItem}>
        <span className={styles.statisticValue}>{killed.total}</span>
        <span className={styles.statisticLabel}>Total Killed</span>
      </div>
      <div className={styles.statisticItem}>
        <span className={styles.statisticValue}>{killed.children}</span>
        <span className={styles.statisticLabel}>Children Killed</span>
      </div>
      <div className={styles.statisticItem}>
        <span className={styles.statisticValue}>{killed.women}</span>
        <span className={styles.statisticLabel}> women killed</span>
      </div>
      <div className={styles.statisticItem}>
        <span className={styles.statisticValue}>{killed.civil_defence}</span>
        <span className={styles.statisticLabel}>civile Defense Killed</span>
      </div>
      <div className={styles.statisticItem}>
        <span className={styles.statisticValue}>{killed.press}</span>
        <span className={styles.statisticLabel}>Press Killed</span>
      </div>
      <div className={styles.statisticItem}>
        <span className={styles.statisticValue}>{killed.medical}</span>
        <span className={styles.statisticLabel}>Medical staff Killed</span>
      </div>
      <div className={styles.statisticItem}>
        <span className={styles.statisticValue}>{injured.total}</span>
        <span className={styles.statisticLabel}>Total Injured</span>
      </div>
    </div>
  );
}

export default GazaSummary;
