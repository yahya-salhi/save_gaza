/* eslint-disable react/prop-types */
import { memo } from "react";
import styles from "./Map.module.css";

import RangeSlider from "./RangeSlider";
import Statistics from "./Statistics";
import ChartLine from "./ChartLine";
import Message from "./Message";
import PieChart from "./PieChart";

const Map = memo(function Map({
  error,
  selectedDate,
  data,
  isLoading,
  setSelectedDate,
}) {
  const selectedData = data.find((item) => item.report_date === selectedDate);
  const latestData = data[data.length - 1] || {};

  return (
    <div className={styles.mapContainer}>
      <h2 className={styles.mapTitle}>Gaza Conflict Statistics</h2>
      <p className={styles.mapDescription}>
        Visualizing data and trends over time
      </p>

      {isLoading && (
        <Message message="Loading data..." className={styles.loading} />
      )}
      {error && <p className={styles.error}>{error}</p>}

      {!isLoading && !error && (
        <>
          <RangeSlider data={data} onDateChange={setSelectedDate} />

          <div className={styles.pieChartContainer}>
            <PieChart data={selectedData} />
          </div>

          <ChartLine data={data} selectedDate={selectedDate} />

          <Statistics data={selectedData} latestData={latestData} />

          <div className={styles.legendContainer}>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: "var(--color-brand--1)" }}
              ></div>
              <span>Casualties</span>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: "var(--color-brand--2)" }}
              ></div>
              <span>Injuries</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default Map;
