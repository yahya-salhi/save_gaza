import { useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { gazaRegions } from "../Data/GazaRegions";
import RegionPolygon from "./RegionPolygon/RegionPolygon";
import RegionInfo from "./RegionInfo/RegionInfo";
import styles from "./GazaMap.module.css";
import "leaflet/dist/leaflet.css";

const GazaMap = () => {
  const [mapPosition] = useState([31.50188, 34.46687]);
  const [mounted, setMounted] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegionClick = (region) => {
    setSelectedRegion(region === selectedRegion ? null : region);
  };

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <div className={styles.mapContainer}>
        <MapContainer
          center={mapPosition}
          zoom={11}
          zoomControl={false}
          className={styles.map}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <ZoomControl position="bottomright" />

          {gazaRegions.map((region) => {
            return (
              <Marker
                position={[
                  region.centerCoordinates.lat,
                  region.centerCoordinates.lng,
                ]}
                key={region.name}
                eventHandlers={{
                  click: () => handleRegionClick(region), // Attach click event here
                }}
              >
                <Popup>{region.name}</Popup>
              </Marker>
            );
          })}
          {gazaRegions.map((region) => (
            <RegionPolygon
              key={region.name}
              region={region}
              onRegionClick={handleRegionClick}
              isSelected={selectedRegion?.name === region.name}
            />
          ))}
        </MapContainer>
      </div>
      <RegionInfo selectedRegion={selectedRegion} />
    </div>
  );
};

export default GazaMap;
