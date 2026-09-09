import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../shared/api/client.js";

/**
 * useSummary — TanStack Query hook for the current verified summary.
 *
 * Consumes `GET /api/v1/summary` through the envelope-aware client, which
 * returns the unwrapped `summary` payload. Served by the backend proxy in
 * production; the dev-only upstream fallback lives in shared/api/client.js.
 *
 * Slice 2.3 wires this into the Hero in place of the fixture.
 */
export function useSummary() {
  return useQuery({
    queryKey: ["summary"],
    queryFn: () => apiGet("/summary"),
    staleTime: 5 * 60 * 1000,
  });
}
