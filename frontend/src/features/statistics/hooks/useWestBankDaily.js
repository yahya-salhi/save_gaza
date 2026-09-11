import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../shared/api/client.js";

/**
 * @typedef {object} WestBankDaily
 * @property {string} report_date
 * @property {string} [flash_source]
 * @property {number} [killed_cum]
 * @property {number} [killed_children_cum]
 * @property {number} [injured_cum]
 * @property {number} [injured_children_cum]
 * @property {number} [settler_attacks_cum]
 * @property {number} [displaced_households_cum]
 * @property {number} [displaced_persons_cum]
 * @property {number} [displaced_children_cum]
 */

/**
 * useWestBankDaily — TanStack Query hook for the latest West Bank snapshot.
 *
 * Fetches `GET /api/v1/statistics/west-bank` through the envelope-aware client.
 * 5-minute staleTime keeps dashboard re-renders cheap; 30-second refetch
 * interval catches upstream updates without hammering the backend.
 *
 * @returns {import("@tanstack/react-query").UseQueryResult<WestBankDaily, Error>}
 */
export function useWestBankDaily() {
  return useQuery({
    queryKey: ["statistics", "west-bank"],
    queryFn: () => apiGet("/statistics/west-bank"),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30_000,
  });
}
