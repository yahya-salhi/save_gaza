import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../shared/api/client.js";

/**
 * @typedef {object} BoundaryFeature
 * @property {string} id
 * @property {{ id: string, name: string, sortOrder: number }} properties
 * @property {{ type: string, coordinates: Array<Array<[number, number]>> }} geometry
 */

/**
 * @typedef {object} BoundariesData
 * @property {string} type
 * @property {BoundaryFeature[]} features
 */

/**
 * useBoundaries — TanStack Query hook for the static Gaza governorate polygons.
 *
 * Fetches `GET /api/v1/spatial/boundaries` through the envelope-aware client.
 * The payload is static (24h backend cache), so staleTime is a full day and
 * there is no refetch interval — unlike the live casualty hooks.
 *
 * @returns {import("@tanstack/react-query").UseQueryResult<BoundariesData, Error>}
 */
export function useBoundaries() {
  return useQuery({
    queryKey: ["spatial", "boundaries"],
    queryFn: () => apiGet("/spatial/boundaries"),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
