import { useEffect, useRef } from "react";
import { CircleMarker } from "react-leaflet";
import styles from "./MapContainer.module.css";
import { pinPopupCard } from "./popupCard.js";

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
export default function PinMarker({ pin }) {
  const ref = useRef(/** @type {any} */ (null));

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return undefined;
    layer.bindPopup(pinPopupCard(pin));
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
