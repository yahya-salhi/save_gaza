import type { FeedPort } from "../../core/ports/FeedPort.js";
import type { WestBankDailyRow } from "../../core/schemas/westBankDaily.js";
import { WestBankDailySchema } from "../../core/schemas/westBankDaily.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import { config } from "../../config.js";
import { fetchJson } from "./fetchJson.js";

/**
 * TechForPalestineWestBankClient — external adapter that fetches the West Bank
 * daily `west_bank_daily.json` feed and returns validated rows.
 *
 * Thin config adapter over the shared `fetchJson` transport: URL, timeout,
 * and label travel here; fetching, timeout, and 502 mapping live in the
 * module. Validates the payload against the Zod contract once, so the
 * application use case consumes typed rows without re-validating.
 *
 * Implements FeedPort (dependency inversion). Uses Node's global fetch; no
 * extra HTTP dependency required.
 */
export class TechForPalestineWestBankClient
  implements FeedPort<WestBankDailyRow>
{
  async getDailyRows(): Promise<WestBankDailyRow[]> {
    const raw = await fetchJson(config.westBankFeedUrl, {
      timeoutMs: 15_000,
      label: "West Bank",
    });

    const result = WestBankDailySchema.safeParse(raw);
    if (!result.success) {
      throw new ExternalApiError("West Bank feed returned invalid data");
    }
    return Array.isArray(result.data) ? result.data : result.data.data;
  }
}
