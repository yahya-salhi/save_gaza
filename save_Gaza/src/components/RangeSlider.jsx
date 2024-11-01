/* eslint-disable react/prop-types */
import { useState } from "react";
import Slider from "react-slider";
import styles from "./RangeSlider.module.css";

const RangeSlider = ({ startDate = "2023-10-07", data = [] }) => {
  const [sliderValue, setSliderValue] = useState(0);

  const getDaysDifference = () => {
    const start = new Date(startDate);
    const end = new Date();
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  const getTrackStyle = (index) => {
    const targetDate = formatDate(
      new Date(startDate).setDate(new Date(startDate).getDate() + index)
    );

    const isDataAvailable = data?.some(
      (entry) => entry.report_date === targetDate
    );
    if (isDataAvailable && index >= sliderValue) {
      return styles.full;
    } else {
      return styles.empty;
    }
  };

  const totalDays = getDaysDifference();

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.dateDisplay}>
        {formatDate(
          new Date(startDate).setDate(
            new Date(startDate).getDate() + sliderValue
          )
        )}{" "}
        (Day {sliderValue})
      </div>
      <Slider
        className={styles.slider}
        min={0}
        max={totalDays}
        value={sliderValue}
        onChange={setSliderValue}
        renderTrack={(props, state) => {
          // Destructure the key to use it directly, then spread the remaining props
          const { key, ...otherProps } = props;
          return (
            <div
              key={`track-${state.index}`} // Use key directly here
              {...otherProps}
              className={`${styles.track} ${getTrackStyle(state.index)}} 
            

              `}
            />
          );
        }}
        renderThumb={(props, state) => {
          const { key, ...otherProps } = props; // Destructure the key
          return (
            <div
              key={`thumb-${state.index}`} // Use key directly here
              {...otherProps}
              className={styles.thumb}
            />
          );
        }}
      />
    </div>
  );
};

export default RangeSlider;
