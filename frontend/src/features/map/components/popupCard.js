import styles from "./MapContainer.module.css";

/**
 * popupCard — single owner of Leaflet popup HTML for the map canvas.
 *
 * Pin popups inject HTML strings into Leaflet (`bindPopup`), so escaping
 * lives here — previously written twice (a helper plus an inline copy) and
 * untested. Same obsidian card language as the RegionInfo panel; logical
 * properties only (via the shared stylesheet classes).
 *
 * Governorate polygons deliberately have no click popup: selection is shown
 * in the RegionInfo panel instead.
 */

/**
 * Escape a string before injecting it into Leaflet popup HTML.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

/**
 * Themed popup card for one APPROVED incident pin: eyebrow + title +
 * LTR mono date + region.
 *
 * @param {import("../hooks/usePins.js").IncidentPin} pin
 * @returns {string} HTML string for `layer.bindPopup`
 */
export function pinPopupCard(pin) {
  return (
    `<div class="${styles.pinPopup}">` +
    `<p class="${styles.pinEyebrow}">Field report</p>` +
    `<p class="${styles.pinTitle}">${escapeHtml(pin.title)}</p>` +
    `<p class="${styles.pinNote}"><span dir="ltr" class="${styles.pinDate}">${escapeHtml(pin.reportDate)}</span> · ${escapeHtml(pin.region)}</p>` +
    `</div>`
  );
}
