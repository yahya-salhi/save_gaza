/* eslint-disable react/prop-types */
import styles from "./RegionInfo.module.css";

const RegionInfo = ({ selectedRegion }) => {
  if (!selectedRegion) {
    return (
      <div className={styles.regionInfo}>
        <h2 className={styles.title}>Region Information</h2>
        <p>Click on a region to view its details</p>
      </div>
    );
  }

  return (
    <div className={styles.regionInfo}>
      <h2 className={styles.title}>{selectedRegion.name}</h2>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Population</span>
          <span className={styles.value}>{selectedRegion.population}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Area</span>
          <span className={styles.value}>{selectedRegion.area} km²</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Major City</span>
          <span className={styles.value}>{selectedRegion.majorCity}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Key Facts</span>
          <span className={styles.value}>{selectedRegion.keyFacts}</span>
        </div>
      </div>
      <div
        className={styles.colorIndicator}
        style={{ backgroundColor: selectedRegion.color }}
      />
    </div>
  );
};

export default RegionInfo;
