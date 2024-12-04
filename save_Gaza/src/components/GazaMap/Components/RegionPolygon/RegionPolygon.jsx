/* eslint-disable react/prop-types */
import { Polygon } from "react-leaflet";
import styles from "./RegionPolygon.module.css";

const RegionPolygon = ({ region, onRegionClick, isSelected }) => {
  return (
    <Polygon
      positions={region.coordinates}
      pathOptions={{
        fillColor: region.color,
        fillOpacity: isSelected ? 0.8 : 0.6,
        weight: 2,
        opacity: 1,
        color: "white",
      }}
      className={styles.polygon}
      eventHandlers={{
        click: () => onRegionClick(region),
      }}
    />
  );
};

export default RegionPolygon;
