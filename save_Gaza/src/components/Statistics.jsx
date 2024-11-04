import styles from "./Statistics.module.css";

function Statistics() {
  return (
    <div className={styles.infoPanel}>
      <div className={styles.stat}>
        <h2>Deaths</h2>
        <p>448</p>
      </div>
      <div className={styles.stat}>
        <h2>Injuries</h2>
        <p>240</p>
      </div>
      <div className={styles.stat}>
        <h2>Displaced</h2>
        <p>52,000</p>
      </div>
      <div className={styles.stat}>
        <h2>Buildings Destroyed</h2>
        <p>1,800</p>
      </div>
    </div>
  );
}

export default Statistics;
