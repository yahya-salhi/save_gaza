import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../shared/api/client.js";

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
  if (!bbox) return "/api/v1/incidents/pins";
  return `/api/v1/incidents/pins?bbox=${bbox.join(",")}`;
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
 * @param {[number, number, number, number]|null|undefined} bbox optional filter window
 * @returns {import("@tanstack/react-query").UseQueryResult<PinsData, Error>}
 */
export function usePins(bbox) {
  const key = bbox ? bbox.join(",") : "all";
  return useQuery({
    queryKey: ["spatial", "pins", key],
    queryFn: () => apiGet(buildPinsEndpoint(bbox)),
    staleTime: 10 * 60 * 1000,
  });
}
