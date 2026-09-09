import type { SummaryFeedPort } from "../../core/ports/SummaryFeedPort.js";
import type { Summary } from "../../core/entities/Summary.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import { config } from "../../config.js";

/**
 * TechForPalestineSummaryClient — external adapter that fetches the current
 * summary from the TechForPalestine v3 `summary.json` feed and returns the
 * raw JSON payload for the use case to validate.
 *
 * Implements the SummaryFeedPort (dependency inversion). Uses Node's global
 * fetch; no extra HTTP dependency required. Non-2xx responses and transport
 * failures map to ExternalApiError (502).
 */
export class TechForPalestineSummaryClient implements SummaryFeedPort {
  async getSummary(): Promise<Summary> {
    let res: Response;
    try {
      res = await fetch(config.summaryFeedUrl, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      throw new ExternalApiError(`Summary feed request failed: ${message}`);
    }

    if (!res.ok) {
      throw new ExternalApiError(
        `Summary feed returned ${res.status} ${res.statusText}`,
      );
    }

    try {
      return (await res.json()) as Summary;
    } catch {
      throw new ExternalApiError("Summary feed returned invalid JSON");
    }
  }
}
