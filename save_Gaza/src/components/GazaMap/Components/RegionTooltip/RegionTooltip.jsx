/* eslint-disable react/prop-types */
import styles from "./RegionTooltip.module.css";

const RegionTooltip = ({ name, population, area, majorCity, keyFacts }) => {
  return (
    <div className={styles.tooltip}>
      <h3 className={styles.title}>{name}</h3>
      <p className={styles.info}>
        <span className={styles.label}>Population:</span> {population}
      </p>
      <p className={styles.info}>
        <span className={styles.label}>Area:</span> {area} km²
      </p>
      <p className={styles.info}>
        <span className={styles.label}>Major City:</span> {majorCity}
      </p>
      <p className={styles.info}>
        <span className={styles.label}>Key Facts:</span> {keyFacts}
      </p>
    </div>
  );
};

export default RegionTooltip;
