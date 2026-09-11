import { makeQueryHook } from "../../../shared/api/queryHooks.js";

/**
 * useSummary — TanStack Query hook for the current verified summary.
 *
 * Consumes `GET /api/v1/summary` through the envelope-aware client, which
 * returns the unwrapped `summary` payload. Served by the backend proxy in
 * production; the dev-only upstream fallback lives in shared/api/client.js.
 *
 * Slice 2.3 wires this into the Hero in place of the fixture.
 *
 * @typedef {import("../components/Hero.jsx").SummaryData} SummaryData
 * @type {() => import("@tanstack/react-query").UseQueryResult<SummaryData, Error>}
 */
export const useSummary = makeQueryHook(() => ({
  queryKey: ["summary"],
  endpoint: "/summary",
  staleTime: 5 * 60 * 1000,
}));
