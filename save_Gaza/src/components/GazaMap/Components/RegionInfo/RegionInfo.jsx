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

  const { name, population, area, majorCity, keyFacts, additionalInfo, color } =
    selectedRegion;

  return (
    <div className={styles.regionInfo}>
      <h2 className={styles.title}>{name}</h2>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Population</span>
          <span className={styles.value}>{population}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Area</span>
          <span className={styles.value}>{area} km²</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Major City</span>
          <span className={styles.value}>{majorCity}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Key Facts</span>
          <span className={styles.value}>{keyFacts}</span>
        </div>
      </div>

      <h3 className={styles.subTitle}>Additional Information</h3>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Main Industries</span>
          <ul className={styles.value}>
            {additionalInfo.mainIndustries.map((industry, index) => (
              <li key={index}>{industry}</li>
            ))}
          </ul>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Landmarks</span>
          <ul className={styles.value}>
            {additionalInfo.landmarks.map((landmark, index) => (
              <li key={index}>{landmark}</li>
            ))}
          </ul>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Challenges</span>
          <ul className={styles.value}>
            {additionalInfo.challenges.map((challenge, index) => (
              <li key={index}>{challenge}</li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={styles.colorIndicator}
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export default RegionInfo;
