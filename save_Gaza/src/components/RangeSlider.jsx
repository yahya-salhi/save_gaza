/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./RangeSlider.module.css";

const RangeSlider = ({ data, onDateChange }) => {
  const reportDates = data.map((item) => item.report_date);
  const [sliderIndex, setSliderIndex] = useState(0);

  const referenceDate = new Date("2023-10-07");

  const formatDateWithDayCount = (dateStr) => {
    const currentDate = new Date(dateStr);
    const dayCount = Math.floor(
      (currentDate - referenceDate) / (1000 * 60 * 60 * 24)
    );
    const options = { month: "long", day: "numeric" };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);
    return `${formattedDate} (Day ${dayCount})`;
  };

  const handleSliderChange = (e) => {
    const newIndex = Number(e.target.value);
    setSliderIndex(newIndex);
    onDateChange(reportDates[newIndex]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.dateDisplay}>
        {formatDateWithDayCount(reportDates[sliderIndex])}
      </div>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min={0}
          max={reportDates.length - 1}
          value={sliderIndex}
          onChange={handleSliderChange}
          className={styles.slider}
        />
        <div className={styles.tickMarks}>
          {reportDates.map((_, index) => (
            <div
              key={index}
              className={`${styles.tick} ${
                index <= sliderIndex ? styles.activeTick : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
