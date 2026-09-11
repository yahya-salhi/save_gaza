import { useMapEvents } from "react-leaflet";
import { boundsToBbox } from "../viewport.js";

/**
 * ViewportTracker — reports the live Leaflet viewport to the parent on
 * `moveend` (pan/zoom settled), projected onto a rounded bbox tuple.
 * `moveend` — never live `move` — keeps request volume sane.
 *
 * @param {{ onViewport: (bbox: [number, number, number, number]) => void }} props
 */
export default function ViewportTracker({ onViewport }) {
  useMapEvents({
    moveend: (event) => {
      onViewport(boundsToBbox(event.target.getBounds()));
    },
  });
  return null;
}
