import { useState, useEffect } from "react";
import styles from "./Map.module.css";
import HeaderMap from "./HeaderMap";
import RangeSlider from "./RangeSlider";
import Statistics from "./Statistics";
import ChartLine from "./ChartLine";
import Message from "./Message";

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

  return (
    <>
      <div className={styles.mapContainer}>
        <HeaderMap />
        {isLoading && <Message Message={"Loading data..."} />}
        {error && <p className={styles.error}>{error}</p>}
        {!isLoading && !error && (
          <div>
            <RangeSlider data={data} onDateChange={setSelectedDate} />
            <ChartLine data={data} selectedDate={selectedDate} />
          </div>
        )}
      </div>
      <div className={styles.dashboard}></div>
    </>
  );
}

export default Map;
