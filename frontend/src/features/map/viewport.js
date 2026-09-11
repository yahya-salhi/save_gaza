/**
 * Viewport helpers — Slice 4.4 spatial wiring.
 *
 * The canvas derives its pins query bbox from the live Leaflet viewport on
 * `moveend`. Coordinates are rounded to 2 decimals so a few-pixel pan never
 * mints a new TanStack query key or a new server cache entry — panning back
 * over visited ground is a cache hit on both layers.
 */

/**
 * Gaza Strip envelope as `[minLng, minLat, maxLng, maxLat]` — initial query window.
 *
 * @type {[number, number, number, number]}
 */
export const GAZA_BBOX = [34.2, 31.18, 34.58, 31.62];

/**
 * Round a coordinate to 2 decimals for stable bbox cache keys.
 *
 * @param {number} n
 * @returns {number}
 */
export function round2(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Project a `[minLng, minLat, maxLng, maxLat]` bbox onto Leaflet
 * `[[southLat, westLng], [northLat, eastLng]]` bounds.
 *
 * Single coordinate truth lives here: the canvas derives its Leaflet bounds
 * from `GAZA_BBOX` through this helper, so the two orders can never drift.
 *
 * @param {[number, number, number, number]} bbox
 * @returns {[[number, number], [number, number]]}
 */
export function bboxToBounds(bbox) {
  return [
    [bbox[1], bbox[0]],
    [bbox[3], bbox[2]],
  ];
}
/**
 * Project a Leaflet `LatLngBounds` onto a rounded bbox tuple.
 *
 * @param {{ getSouthWest: () => { lng: number, lat: number }, getNorthEast: () => { lng: number, lat: number } }} bounds
 * @returns {[number, number, number, number]} `[minLng, minLat, maxLng, maxLat]`
 */
export function boundsToBbox(bounds) {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return [round2(sw.lng), round2(sw.lat), round2(ne.lng), round2(ne.lat)];
}
