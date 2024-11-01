import { useState, useEffect, useMemo } from "react";
import styles from "./Map.module.css";
import HeaderMap from "./HeaderMap";
import RangeSlider from "./RangeSlider";
import Statistics from "./Statistics";
import ChartLine from "./ChartLine";

function Map() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://data.techforpalestine.org/api/v2/casualties_daily.json"
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const fetchedData = await res.json();
        setData(fetchedData);
        if (fetchedData.length > 0) {
          setSelectedDate(fetchedData[fetchedData.length - 1].report_date);
        }
      } catch (err) {
        setError("There was an error loading API data");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => item.report_date <= selectedDate);
  }, [data, selectedDate]);

  return (
    <>
      <div className={styles.mapContainer}>
        <HeaderMap />
        {isLoading && <p>Loading data...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!isLoading && !error && (
          <ChartLine data={filteredData} selectedDate={selectedDate} />
        )}
        {/* <Statistics /> */}
        {/* <RangeSlider
          startDate="2023-10-07"
          data={data}
          onDateChange={handleDateChange}
          selectedDate={selectedDate}
        /> */}
      </div>
      <div className={styles.dashboard}></div>
    </>
  );
}

export default Map;
