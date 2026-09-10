import { MapContainer as LeafletMap, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapContainer.module.css";

/** Gaza Strip envelope — initial fit and pan limit: the canvas never leaves Gaza. */
const GAZA_BOUNDS = [
  [31.18, 34.2],
  [31.62, 34.58],
];

/**
 * GazaMapCanvas — lazy-loaded Leaflet canvas (default export for React.lazy).
 *
 * Observatory-styled Gaza instrument: dark-filtered tiles locked inside the
 * Gaza envelope, five governorate polygons filled down the accent ramp with
 * permanent mono labels, click-to-select with a glow state. Selection is
 * owned by the parent page (`selectedId` / `onSelect`) so the map, legend,
 * and region list stay in sync. Per-governorate casualty data is NOT shown
 * here — it wires in Slice 4.2 via `GET /spatial/regions/:id`.
 *
 * @param {object} props
 * @param {import("../hooks/useBoundaries.js").BoundariesData} props.data
 * @param {string|null} props.selectedId
 * @param {(id: string) => void} props.onSelect
 */
export default function GazaMapCanvas({ data, selectedId, onSelect }) {
  const features = [...(data?.features ?? [])].sort(
    (a, b) => a.properties.sortOrder - b.properties.sortOrder,
  );
  const selected = features.find((f) => f.id === selectedId) ?? null;

  /**
   * @param {any} feature
   */
  const styleFeature = (feature) => ({
    className: [
      styles.governorate,
      feature?.id ? (styles[`region-${feature.id}`] ?? "") : "",
      feature?.id === selectedId ? styles.selected : "",
    ].join(" "),
  });

  /**
   * @param {any} feature
   * @param {any} layer
   */
  const bindFeature = (feature, layer) => {
    const name = String(feature.properties?.name ?? feature.id);
    layer.bindTooltip(name, {
      permanent: true,
      direction: "center",
      className: styles.governorateLabel,
    });
    layer.bindPopup(
      `<strong>${name}</strong><br />Per-governorate casualty data arrives in Slice 4.2.`,
    );
    layer.on("click", () => {
      if (feature.id) onSelect(feature.id);
    });
  };

  return (
    <div className={styles.canvas} aria-label="Interactive map of Gaza governorates">
      <LeafletMap
        bounds={/** @type {any} */ (GAZA_BOUNDS)}
        boundsOptions={{ padding: [24, 24] }}
        minZoom={9}
        maxZoom={14}
        maxBounds={/** @type {any} */ (GAZA_BOUNDS)}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={false}
        zoomControl={false}
        className={styles.leaflet}
      >
        <ZoomControl position="bottomleft" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          key={selectedId ?? "none"}
          data={/** @type {any} */ (data)}
          style={styleFeature}
          onEachFeature={bindFeature}
        />
      </LeafletMap>
      <div className={styles.mapHeader} aria-hidden="true">
        <p className={styles.mapEyebrow}>Gaza Strip</p>
        <p className={styles.mapTitle}>5 governorates · simplified</p>
      </div>
      <p className={styles.readout} aria-hidden="true">
        {selected ? selected.properties.name : "No region selected"}
      </p>
      <ul className={styles.legend} aria-hidden="true">
        {features.map((feature) => (
          <li
            key={feature.id}
            className={
              feature.id === selectedId
                ? `${styles.legendItem} ${styles.legendActive}`
                : styles.legendItem
            }
          >
            <span
              className={`${styles.swatch} ${styles[`region-${feature.id}`] ?? ""}`}
            />
            {feature.properties.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
