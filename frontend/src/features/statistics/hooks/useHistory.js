import { makeQueryHook } from "../../../shared/api/queryHooks.js";

/**
 * @typedef {object} HistoryDay
 * @property {string} report_date
 * @property {number} [report_period]
 * @property {number} [killed_cum]
 * @property {number} [injured_cum]
 * @property {number} [killed_children_cum]
 * @property {number} [killed_women_cum]
 */

/**
 * @typedef {object} HistoryData
 * @property {HistoryDay[]} items
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 */

/**
 * @typedef {object} HistoryParams
 * @property {string} [startDate] - YYYY-MM-DD window start
 * @property {string} [endDate] - YYYY-MM-DD window end
 * @property {number} [page]
 * @property {number} [limit]
 */

/**
 * Build the history endpoint path with only defined params. The chart
 * requests the whole selected window in one query (`limit` up to the
 * backend cap of 1000); pagination exists for researchers paging, not for
 * the chart to stitch.
 *
 * @param {HistoryParams} [params]
 * @returns {string}
 */
export function buildHistoryEndpoint(params = {}) {
  const { startDate, endDate, page = 1, limit = 1000 } = params;
  const query = new URLSearchParams();
  if (startDate) query.set("startDate", startDate);
  if (endDate) query.set("endDate", endDate);
  query.set("page", String(page));
  query.set("limit", String(limit));
  return `/statistics/history?${query.toString()}`;
}

/**
 * useHistory — TanStack Query hook for Gaza range-filtered daily telemetry.
 *
 * Fetches `GET /api/v1/statistics/history` through the envelope-aware
 * client. Same caching posture as the sibling daily hooks: 5-minute
 * staleTime with a 30-second refetch interval. The `options` argument
 * supports `enabled` (e.g. a fallback query that only runs when the main
 * window has no demographics) and `refetchInterval` overrides.
 *
 * @type {(params?: HistoryParams, options?: { enabled?: boolean, refetchInterval?: number | false }) => import("@tanstack/react-query").UseQueryResult<HistoryData, Error>}
 */
export const useHistory = makeQueryHook((params = {}, options = {}) => {
  const { startDate, endDate, page = 1, limit = 1000 } = params;
  const { enabled = true, refetchInterval = 30_000 } = options;
  return {
    queryKey: ["statistics", "history", startDate, endDate, page, limit],
    endpoint: buildHistoryEndpoint(params),
    staleTime: 5 * 60 * 1000,
    refetchInterval,
    enabled,
  };
});
