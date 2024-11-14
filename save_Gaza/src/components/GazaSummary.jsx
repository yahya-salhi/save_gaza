/* eslint-disable react/prop-types */
import {
  FaChild,
  FaUserMd,
  FaUserShield,
  FaFemale,
  FaNewspaper,
  FaAmbulance,
  FaHeartBroken,
} from "react-icons/fa";
import styles from "./GazaSummary.module.css"; // Import the CSS module
import { Link } from "react-router-dom";

function GazaSummary({ gaza, isLoading }) {
  if (isLoading) return <p>Loading...</p>;
  if (!gaza || !gaza.killed || !gaza.injured) return <p>No data available</p>;

  const { massacres, killed, injured } = gaza;

  return (
    <div className={styles.statisticsContainer}>
      <div>
        <Link to={`${massacres}`} className={styles.statisticItem}>
          <FaUserShield className={styles.icon} />
          <span className={styles.statisticValue}> {massacres} </span>
          <span className={styles.statisticLabel}> Massacres </span>
        </Link>
      </div>
      <div className={styles.statisticItem}>
        <Link to={`${killed.total}`}>
          <FaHeartBroken className={styles.icon} />
          <span className={styles.statisticValue}>
            <strong>{killed.total}</strong>
          </span>
          <span className={styles.statisticLabel}>Total Killed</span>
        </Link>
      </div>
      <div className={styles.statisticItem}>
        <Link to={`${killed.children}`}>
          <FaChild className={styles.icon} />
          <span className={styles.statisticValue}>{killed.children}</span>
          <span className={styles.statisticLabel}>Children Killed</span>
        </Link>
      </div>
      <div className={styles.statisticItem}>
        <FaFemale className={styles.icon} />
        <span className={styles.statisticValue}>{killed.women}</span>
        <span className={styles.statisticLabel}>Women Killed</span>
      </div>
      <div className={styles.statisticItem}>
        <FaUserShield className={styles.icon} />
        <span className={styles.statisticValue}>{killed.civil_defence}</span>
        <span className={styles.statisticLabel}>Civil Defense Killed</span>
      </div>
      <div className={styles.statisticItem}>
        <FaNewspaper className={styles.icon} />
        <span className={styles.statisticValue}>{killed.press}</span>
        <span className={styles.statisticLabel}>Press Killed</span>
      </div>
      <div className={styles.statisticItem}>
        <FaUserMd className={styles.icon} />
        <span className={styles.statisticValue}>{killed.medical}</span>
        <span className={styles.statisticLabel}>Medical Staff Killed</span>
      </div>
      <div className={styles.statisticItem}>
        <FaAmbulance className={styles.icon} />
        <span className={styles.statisticValue}>{injured.total}</span>
        <span className={styles.statisticLabel}>Total Injured</span>
      </div>
    </div>
  );
}

export default GazaSummary;
