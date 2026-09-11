import { makeQueryHook } from "../../../shared/api/queryHooks.js";

/**
 * @typedef {object} RegionData
 * @property {string} id
 * @property {string} name
 * @property {number} sortOrder
 * @property {number} position
 * @property {[number, number]} centroid
 * @property {[number, number, number, number]} bbox
 * @property {number} areaKm2
 * @property {number} population2017
 * @property {string} overviewSource
 * @property {string} adminCentre
 * @property {string[]} localities
 * @property {string} blurb
 */

/**
 * useRegion — TanStack Query hook for one governorate's static metadata.
 *
 * Fetches `GET /api/v1/spatial/regions/:id` through the envelope-aware
 * client. The payload is static identity metadata (24h backend cache), so
 * staleTime is a full day with no refetch interval. Disabled while no
 * region is selected — the panel shows its empty-selection prompt instead.
 *
 * @type {(id: string | null | undefined) => import("@tanstack/react-query").UseQueryResult<RegionData, Error>}
 */
export const useRegion = makeQueryHook((id) => ({
  queryKey: ["spatial", "region", id],
  endpoint: `/spatial/regions/${id}`,
  enabled: id !== null && id !== undefined && id !== "",
  staleTime: 24 * 60 * 60 * 1000,
}));
