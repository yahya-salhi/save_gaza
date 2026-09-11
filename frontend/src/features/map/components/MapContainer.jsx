import { useEffect, useRef, useState } from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  GeoJSON,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapContainer.module.css";
import { usePins } from "../hooks/usePins.js";
import { GAZA_BBOX, bboxToBounds } from "../viewport.js";
import ViewportTracker from "./ViewportTracker.jsx";
import PinMarker from "./PinMarker.jsx";

/**
 * Single coordinate truth: Leaflet `[lat, lng]` bounds derived from the
 * `[lng, lat]` query bbox — the two orders can never drift apart again.
 */
const GAZA_BOUNDS = bboxToBounds(GAZA_BBOX);

/**
 * Stable polygons key: governorate layers mount once for the canvas
 * lifetime. The selection glow refreshes in place (see the effect below),
 * so open popups and tooltips survive selection changes.
 */
const GOVERNORATES_KEY = "governorates";

/**
 * Token classes for one governorate polygon, glow included.
 *
 * @param {any} feature
 * @param {string|null} selectedId
 */
function featureClass(feature, selectedId) {
  return [
    styles.governorate,
    feature?.id ? (styles[`region-${feature.id}`] ?? "") : "",
    feature?.id === selectedId ? styles.selected : "",
  ].join(" ");
}

/**
 * GazaMapCanvas — lazy-loaded Leaflet canvas (default export for React.lazy).
 *
 * Observatory-styled Gaza instrument: dark-filtered tiles locked inside the
 * Gaza envelope, five governorate polygons filled down the accent ramp with
 * permanent mono labels, click-to-select with a glow state. Selection is
 * owned by the parent page (`selectedId` / `onSelect`) so the map, legend,
 * buttons, and `RegionInfo` panel stay in sync. Per-governorate casualty
 * figures are NOT shown here — no upstream dataset publishes them — the
 * panel pairs static identity (`GET /spatial/regions/:id`) with the
 * Gaza-wide tally instead.
 *
 * The live viewport drives `usePins(bbox)` (rounded `moveend` bbox,
 * TanStack-keyed so revisits are cache hits) and APPROVED pins render as
 * accent `CircleMarker`s with themed popups. Markers are popup-only — they
 * never touch selection — and the pins layer is silent-null on
 * loading/error so a pins outage can never take down the boundaries map
 * (empty until Phase 5 moderation is the correct live state, not a bug).
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

  const [bbox, setBbox] = useState(GAZA_BBOX);
  // No-change guard: equivalent viewports (e.g. mount settle) keep the same
  // key so TanStack serves cache instead of refetching and remounting pins.
  /**
   * @param {[number, number, number, number]} next
   */
  const handleViewport = (next) => {
    setBbox((prev) =>
      prev[0] === next[0] &&
      prev[1] === next[1] &&
      prev[2] === next[2] &&
      prev[3] === next[3]
        ? prev
        : next,
    );
  };
  // Silent-null by contract: pins loading/error renders no markers, and the
  // boundaries map below stays fully usable.
  const { data: pins } = usePins(bbox);
  const markers = pins?.items ?? [];

  const geoJsonRef = useRef(/** @type {any} */ (null));

  /**
   * @param {any} feature
   */
  const styleFeature = (feature) => ({
    className: featureClass(feature, selectedId),
  });

  // In-place glow refresh: Leaflet applies `className` to the SVG element
  // only at creation (`_initPath`), so `setStyle` alone can't move the glow.
  // Sync our token classes on the live elements directly — Leaflet's own
  // classes are preserved, and layers (with their popups/tooltips) persist.
  useEffect(() => {
    const group = geoJsonRef.current;
    if (!group || typeof group.eachLayer !== "function") return;
    group.eachLayer((/** @type {any} */ layer) => {
      if (!layer.feature) return;
      const next = featureClass(layer.feature, selectedId);
      if (typeof layer.setStyle === "function") {
        layer.setStyle({ className: next });
      }
      const el = typeof layer.getElement === "function" ? layer.getElement() : null;
      if (!el || !el.classList) return;
      const prev = layer.__mapGlowClass;
      if (prev === next) return;
      if (prev) el.classList.remove(...prev.split(" ").filter(Boolean));
      el.classList.add(...next.split(" ").filter(Boolean));
      layer.__mapGlowClass = next;
    });
  }, [selectedId, data]);

  /**
   * @param {any} feature
   * @param {any} layer
   */
  const bindFeature = (feature, layer) => {
    const name = String(feature.properties?.name ?? feature.id);
    // Seed the glow tracker so the refresh effect diffs correctly.
    layer.__mapGlowClass = featureClass(feature, selectedId);
    layer.bindTooltip(name, {
      permanent: true,
      direction: "center",
      className: styles.governorateLabel,
    });
    // No click popup: selection is shown in the RegionInfo panel instead.
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
          key={GOVERNORATES_KEY}
          ref={geoJsonRef}
          data={/** @type {any} */ (data)}
          style={styleFeature}
          onEachFeature={bindFeature}
        />
        <ViewportTracker onViewport={handleViewport} />
        {markers.map((pin) => (
          <PinMarker key={pin.id} pin={pin} />
        ))}
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
