import { ExternalApiError } from "../../core/errors/DomainError.js";

export interface FetchJsonOptions {
  /** Request timeout in ms — enforced via `AbortSignal.timeout`. */
  timeoutMs: number;
  /** Feed name for error messages, e.g. `"Casualties"`. */
  label: string;
}

/**
 * fetchJson — the single owner of upstream HTTP transport behind the
 * TechForPalestine external seam.
 *
 * Fetches a JSON payload with an `Accept: application/json` header and a
 * timeout, mapping transport failures, non-2xx statuses, and unparseable
 * bodies to a labeled `ExternalApiError` (502). Returns the parsed body as
 * `unknown` — validation stays with each adapter, which owns its Zod
 * contract (the daily feeds) or defers to its use case (the Summary tally).
 *
 * @param url - Upstream feed URL (from `config`, kept in the adapters).
 * @param options - Timeout and label (see `FetchJsonOptions`).
 * @returns The parsed JSON body, unvalidated.
 */
export async function fetchJson(
  url: string,
  { timeoutMs, label }: FetchJsonOptions,
): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new ExternalApiError(`${label} feed request failed: ${message}`);
  }

  if (!res.ok) {
    throw new ExternalApiError(
      `${label} feed returned ${res.status} ${res.statusText}`,
    );
  }

  try {
    return await res.json();
  } catch {
    throw new ExternalApiError(`${label} feed returned invalid JSON`);
  }
}
