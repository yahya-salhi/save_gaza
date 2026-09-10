import type { CasualtiesFeedPort } from "../../core/ports/CasualtiesFeedPort.js";
import type { CasualtiesDailyRow } from "../../core/schemas/casualtiesDaily.js";
import { CasualtiesDailySchema } from "../../core/schemas/casualtiesDaily.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import { config } from "../../config.js";

/**
 * TechForPalestineCasualtiesClient — external adapter that fetches the Gaza
 * daily `casualties_daily.json` feed and returns the raw row array for the
 * use case to validate.
 *
 * Implements CasualtiesFeedPort (dependency inversion). Uses Node's global
 * fetch; no extra HTTP dependency required. Non-2xx and transport failures
 * map to ExternalApiError (502).
 */
export class TechForPalestineCasualtiesClient implements CasualtiesFeedPort {
  async getDailyRows(): Promise<CasualtiesDailyRow[]> {
    let res: Response;
    try {
      res = await fetch(config.casualtiesFeedUrl, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15_000),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      throw new ExternalApiError(`Casualties feed request failed: ${message}`);
    }

    if (!res.ok) {
      throw new ExternalApiError(
        `Casualties feed returned ${res.status} ${res.statusText}`,
      );
    }

    try {
      const raw = await res.json();
      const result = CasualtiesDailySchema.parse(raw);
      return Array.isArray(result) ? result : result.data;
    } catch {
      throw new ExternalApiError("Casualties feed returned invalid JSON");
    }
  }
}
