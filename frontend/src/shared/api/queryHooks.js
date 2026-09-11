import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./client.js";

/**
 * Per-render query configuration resolved from the hook arguments. This is
 * the entire surface an adapter must supply: key, endpoint, and timing.
 *
 * @typedef {object} QueryHookConfig
 * @property {unknown[]} queryKey - TanStack query key, stable per arguments.
 * @property {string | (() => string)} endpoint - Backend path starting with
 *   "/", e.g. "/statistics/gaza", or a builder returning one.
 * @property {number} [staleTime] - Cache freshness window in ms.
 * @property {number | false} [refetchInterval] - Live polling interval in ms.
 * @property {boolean} [enabled] - Gate the query (e.g. selection required).
 */

/**
 * makeQueryHook — the single owner of TanStack Query wiring behind the
 * envelope-client seam.
 *
 * Every read-path hook (Summary tally, Gaza daily casualties, West Bank
 * telemetry, History range query, Incident pins, Spatial boundaries/regions)
 * is a one-line typed adapter over this module: it resolves its key,
 * endpoint, and timing from its arguments and inherits fetching, caching,
 * polling, and error surfacing here. Timing fixes land once.
 *
 * @param {(...args: any[]) => QueryHookConfig} resolve - Maps hook arguments
 *   to the per-render configuration.
 * @returns {(...args: any[]) => import("@tanstack/react-query").UseQueryResult<any, Error>}
 */
export function makeQueryHook(resolve) {
  return function useGeneratedQuery(...args) {
    const { queryKey, endpoint, staleTime, refetchInterval, enabled } =
      resolve(...args);
    const path = typeof endpoint === "function" ? endpoint() : endpoint;
    return useQuery({
      queryKey,
      queryFn: () => apiGet(path),
      staleTime,
      refetchInterval,
      enabled,
    });
  };
}
