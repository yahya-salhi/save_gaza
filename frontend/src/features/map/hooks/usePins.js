import { makeQueryHook } from "../../../shared/api/queryHooks.js";

/**
 * @typedef {object} IncidentPin
 * @property {string} id
 * @property {string} title
 * @property {string} reportDate
 * @property {string} region
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * @typedef {object} PinsData
 * @property {IncidentPin[]} items
 * @property {number} total
 */

/**
 * Build the pins endpoint for an optional bbox tuple.
 *
 * @param {[number, number, number, number]|null|undefined} bbox
 * @returns {string} endpoint path consumed by `apiGet`
 */
export function buildPinsEndpoint(bbox) {
  if (!bbox) return "/incidents/pins";
  return `/incidents/pins?bbox=${bbox.join(",")}`;
}

/**
 * usePins — TanStack Query hook for APPROVED incident markers.
 *
 * Fetches `GET /api/v1/incidents/pins` (optional `?bbox=`) through the
 * envelope-aware client. Slice 4.3 is contract-only: the hook, fixture,
 * and tests land here, but no markers render on the canvas — marker
 * rendering + bbox-driven refetch is Slice 4.4 ("Wire Spatial Engine").
 * The backend caches per bbox for 10 minutes, so staleTime matches.
 *
 * @type {(bbox?: [number, number, number, number] | null) => import("@tanstack/react-query").UseQueryResult<PinsData, Error>}
 */
export const usePins = makeQueryHook((bbox) => ({
  queryKey: ["spatial", "pins", bbox ? bbox.join(",") : "all"],
  endpoint: buildPinsEndpoint(bbox),
  staleTime: 10 * 60 * 1000,
}));
