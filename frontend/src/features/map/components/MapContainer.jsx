import { useEffect, useRef, useState } from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  GeoJSON,
  ZoomControl,
  CircleMarker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapContainer.module.css";
import { usePins } from "../hooks/usePins.js";
import { GAZA_BBOX, boundsToBbox } from "../viewport.js";

/** Gaza Strip envelope — initial fit and pan limit: the canvas never leaves Gaza. */
const GAZA_BOUNDS = [
  [31.18, 34.2],
  [31.62, 34.58],
];

/**
 * ViewportTracker — reports the live Leaflet viewport to the parent on
 * `moveend` (pan/zoom settled), projected onto a rounded bbox tuple.
 * `moveend` — never live `move` — keeps request volume sane.
 *
 * @param {{ onViewport: (bbox: [number, number, number, number]) => void }} props
 */
function ViewportTracker({ onViewport }) {
  useMapEvents({
    moveend: (event) => {
      onViewport(boundsToBbox(event.target.getBounds()));
    },
  });
  return null;
}

/**
 * Escape a string before injecting it into Leaflet popup HTML.
 *
 * @param {unknown} value
 */
function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

/**
 * PinMarker — one APPROVED incident pin as an accent CircleMarker.
 *
 * The popup is bound imperatively (the canvas-wide convention, shared with
 * the governorate polygons): it survives the viewport-driven remount cycle
 * deterministically, while a declarative `<Popup>` child proved
 * timing-fragile there. Popup-only interaction — never touches selection.
 *
 * @param {{ pin: import("../hooks/usePins.js").IncidentPin }} props
 */
function PinMarker({ pin }) {
  const ref = useRef(/** @type {any} */ (null));

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return undefined;
    layer.bindPopup(
      `<div class="${styles.pinPopup}">` +
        `<p class="${styles.pinEyebrow}">Field report</p>` +
        `<p class="${styles.pinTitle}">${escapeHtml(pin.title)}</p>` +
        `<p class="${styles.pinNote}"><span dir="ltr" class="${styles.pinDate}">${escapeHtml(pin.reportDate)}</span> · ${escapeHtml(pin.region)}</p>` +
        `</div>`,
    );
    return () => {
      layer.unbindPopup();
    };
  }, [pin]);

  return (
    <CircleMarker
      ref={ref}
      center={[pin.latitude, pin.longitude]}
      radius={6}
      // Flat className (not nested pathOptions): react-leaflet spreads
      // extra props into Leaflet options, and only options.className at
      // creation time reaches the SVG element in `_initPath`.
      className={styles.pinMarker}
    />
  );
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
 * Slice 4.4 wires the spatial engine: the live viewport drives
 * `usePins(bbox)` (rounded `moveend` bbox, TanStack-keyed so revisits are
 * cache hits) and APPROVED pins render as accent `CircleMarker`s with
 * themed popups. Markers are popup-only — they never touch selection —
 * and the pins layer is silent-null on loading/error so a pins outage can
 * never take down the boundaries map (empty until Phase 5 moderation is
 * the correct live state, not a bug).
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
    // Names are static curated strings, but escape before HTML injection.
    const safeName = name.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    layer.bindTooltip(name, {
      permanent: true,
      direction: "center",
      className: styles.governorateLabel,
    });
    layer.bindPopup(
      `<div class="${styles.pinPopup}">` +
        `<p class="${styles.pinEyebrow}">Gaza Strip</p>` +
        `<p class="${styles.pinTitle}">${safeName}</p>` +
        `<p class="${styles.pinNote}">Per-governorate breakdowns are not published by the source.</p>` +
        `</div>`,
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
