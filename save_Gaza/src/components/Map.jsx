import styles from "./Map.module.css";
import HeaderMap from "./HeaderMap";
import RangeSlider from "./RangeSlider";
import Statistics from "./Statistics";
import ChartLine from "./ChartLine";
import { useState, useEffect } from "react";

function Map() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(function () {
    async function fetchstatistic() {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://data.techforpalestine.org/api/v2/casualties_daily.json"
        );
        if (!res.ok) throw new Error("network response was not ok");
        const data = await res.json();
        setData(data);
      } catch (err) {
        setError("there was an error loading Api data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchstatistic();
  }, []);

  return (
    <>
      <div className={styles.mapContainer}>
        <HeaderMap />
        <RangeSlider data={data} isLoading={isLoading} error={error} />

        <ChartLine data={data} />
        {/* <Statistics /> */}
      </div>
      <div className={styles.dashboard}></div>
    </>
  );
}

export default Map;
