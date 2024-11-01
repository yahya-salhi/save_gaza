import { useState, useEffect, useMemo } from "react";
import Slider from "react-slider";
import styles from "./RangeSlider.module.css";

const RangeSlider = ({
  startDate = "2023-10-07",
  data = [],
  onDateChange,
  selectedDate,
}) => {
  const [sliderValue, setSliderValue] = useState(0);

  const { totalDays, formattedDates } = useMemo(() => {
    if (data.length === 0) return { totalDays: 0, formattedDates: [] };

    const start = new Date(startDate);
    const end = new Date(data[data.length - 1].report_date);
    const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));

    const formattedDates = Array.from({ length: totalDays + 1 }, (_, index) => {
      const date = new Date(start);
      date.setDate(date.getDate() + index);
      return date.toISOString().split("T")[0];
    });

    return { totalDays, formattedDates };
  }, [data, startDate]);

  useEffect(() => {
    if (selectedDate) {
      const index = formattedDates.indexOf(selectedDate);
      if (index !== -1) {
        setSliderValue(index);
      }
    }
  }, [selectedDate, formattedDates]);

  const handleSliderChange = (value) => {
    setSliderValue(value);
    onDateChange(formattedDates[value]);
  };

  const getTrackStyle = (index) => {
    const targetDate = formattedDates[index];
    const isDataAvailable = data.some(
      (entry) => entry.report_date === targetDate
    );
    return isDataAvailable && index <= sliderValue ? styles.full : styles.empty;
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.dateDisplay}>
        {formattedDates[sliderValue]} (Day {sliderValue})
      </div>
      <Slider
        className={styles.slider}
        min={0}
        max={totalDays}
        value={sliderValue}
        onChange={handleSliderChange}
        renderTrack={(props, state) => (
          <div
            {...props}
            className={`${styles.track} ${getTrackStyle(state.index)}`}
          />
        )}
        renderThumb={(props) => <div {...props} className={styles.thumb} />}
      />
    </div>
  );
};

export default RangeSlider;
