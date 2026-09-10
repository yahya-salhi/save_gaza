import type { WestBankFeedPort } from "../../core/ports/WestBankFeedPort.js";
import type { WestBankDailyRow } from "../../core/schemas/westBankDaily.js";
import { WestBankDailySchema } from "../../core/schemas/westBankDaily.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import { config } from "../../config.js";

/**
 * TechForPalestineWestBankClient — external adapter that fetches the West Bank
 * daily `west_bank_daily.json` feed and returns the raw row array for the
 * use case to validate.
 *
 * Implements WestBankFeedPort (dependency inversion). Uses Node's global
 * fetch; no extra HTTP dependency required. Non-2xx and transport failures
 * map to ExternalApiError (502).
 */
export class TechForPalestineWestBankClient implements WestBankFeedPort {
  async getDailyRows(): Promise<WestBankDailyRow[]> {
    let res: Response;
    try {
      res = await fetch(config.westBankFeedUrl, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15_000),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      throw new ExternalApiError(`West Bank feed request failed: ${message}`);
    }

    if (!res.ok) {
      throw new ExternalApiError(
        `West Bank feed returned ${res.status} ${res.statusText}`,
      );
    }

    try {
      const raw = await res.json();
      const result = WestBankDailySchema.parse(raw);
      return Array.isArray(result) ? result : result.data;
    } catch {
      throw new ExternalApiError("West Bank feed returned invalid JSON");
    }
  }
}
