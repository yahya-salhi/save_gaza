/* eslint-disable react/prop-types */
import styles from "./Statistics.module.css";

function Statistic({ title, value, latestData = "missing" }) {
  const displayValue = value !== undefined ? value : latestData;

  return (
    <div className={styles.stat}>
      <h2>{title}</h2>
      <p>{displayValue?.toLocaleString()}</p>
    </div>
  );
}

function Statistics({ data }) {
  return (
    <div className={styles.infoPanel}>
      <Statistic title="Injured" value={data?.injured_cum} />
      <Statistic
        title="Children Killed"
        value={data?.ext_killed_children_cum}
      />
      <Statistic title="Women Killed" value={data?.ext_killed_women_cum} />
      <Statistic
        title="Medical Personnel Killed"
        value={data?.ext_med_killed_cum}
      />
      <Statistic
        title="Journalists Killed"
        value={data?.ext_press_killed_cum}
      />
      <Statistic
        title="Emergency Personnel Killed"
        value={data?.ext_civdef_killed_cum}
      />
      {/* 
      
     
      
       */}
    </div>
  );
}

export default Statistics;
