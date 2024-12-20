import { useSummary } from "../context/SummaryContext";
import styles from "./WestBankSummary.module.css";
import {
  FaChild,
  FaUserShield,
  FaAmbulance,
  FaHeartBroken,
} from "react-icons/fa";

function WestBankSummary() {
  const { westBank, isLoading } = useSummary();
  if (isLoading) return <p>Loading...</p>;
  if (!westBank || !westBank.killed || !westBank.injured)
    return <p>No data available</p>;

  const { settler_attacks, killed, injured } = westBank;

  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.statisticItem}>
        <FaUserShield className={styles.icon} />
        <span className={styles.statisticValue}>{settler_attacks}</span>
        <span className={styles.statisticLabel}>Settler Attacks</span>
      </div>
      <div className={styles.statisticItem}>
        <FaHeartBroken className={styles.icon} />
        <span className={styles.statisticValue}>{killed.total}</span>
        <span className={styles.statisticLabel}>Total Killed</span>
      </div>
      <div className={styles.statisticItem}>
        <FaChild className={styles.icon} />
        <span className={styles.statisticValue}>{killed.children}</span>
        <span className={styles.statisticLabel}>Children Killed</span>
      </div>
      <div className={styles.statisticItem}>
        <FaAmbulance className={styles.icon} />
        <span className={styles.statisticValue}>{injured.total}</span>
        <span className={styles.statisticLabel}>Total Injured</span>
      </div>
      <div className={styles.statisticItem}>
        <FaChild className={styles.icon} />
        <span className={styles.statisticValue}>{injured.children}</span>
        <span className={styles.statisticLabel}>Children Injured</span>
      </div>
    </div>
  );
}

export default WestBankSummary;
