import { makeQueryHook } from "../../../shared/api/queryHooks.js";

/**
 * @typedef {object} GazaDaily
 * @property {string} report_date
 * @property {string} report_source
 * @property {number} report_period
 * @property {number} [massacres_cum]
 * @property {number} [killed]
 * @property {number} [killed_cum]
 * @property {number} [killed_children_cum]
 * @property {number} [killed_women_cum]
 * @property {number} [killed_recovered]
 * @property {number} [killed_succumbed]
 * @property {number} [killed_truce_new]
 * @property {number} [killed_committee]
 * @property {number} [child_famine_cum]
 * @property {number} [famine_cum]
 * @property {number} [aid_seeker_killed_cum]
 * @property {number} [aid_seeker_injured_cum]
 * @property {number} [injured]
 * @property {number} [injured_cum]
 * @property {number} [civdef_killed_cum]
 * @property {number} [med_killed_cum]
 * @property {number} [press_killed_cum]
 */

/**
 * useGazaDaily — TanStack Query hook for the latest Gaza casualty/injury snapshot.
 *
 * Fetches `GET /api/v1/statistics/gaza` through the envelope-aware client.
 * 5-minute staleTime keeps dashboard re-renders cheap; 30-second refetch
 * interval catches upstream updates without hammering the backend.
 *
 * @type {() => import("@tanstack/react-query").UseQueryResult<GazaDaily, Error>}
 */
export const useGazaDaily = makeQueryHook(() => ({
  queryKey: ["statistics", "gaza"],
  endpoint: "/statistics/gaza",
  staleTime: 5 * 60 * 1000,
  refetchInterval: 30_000,
}));
