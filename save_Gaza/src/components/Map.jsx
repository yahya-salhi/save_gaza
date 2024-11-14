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
    <>
      <div className={styles.mapContainer}>
        {isLoading && <Message Message={"Loading data..."} />}
        {error && <p className={styles.error}>{error}</p>}
        {!isLoading && !error && (
          <div>
            <RangeSlider data={data} onDateChange={setSelectedDate} />
            <ChartLine data={data} selectedDate={selectedDate} />
            <Statistics data={selectedData} latestData={latestData} />
            <div className={styles.pieChartContainer}>
              <PieChart data={selectedData} />
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export default Map;
