import type { FeedPort } from "../../core/ports/FeedPort.js";
import type { CasualtiesDailyRow } from "../../core/schemas/casualtiesDaily.js";
import { CasualtiesDailySchema } from "../../core/schemas/casualtiesDaily.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import { config } from "../../config.js";
import { fetchJson } from "./fetchJson.js";

/**
 * TechForPalestineCasualtiesClient — external adapter that fetches the Gaza
 * daily `casualties_daily.json` feed and returns validated rows.
 *
 * Thin config adapter over the shared `fetchJson` transport: URL, timeout,
 * and label travel here; fetching, timeout, and 502 mapping live in the
 * module. Validates the payload against the Zod contract once, so the
 * application use case consumes typed rows without re-validating.
 *
 * Implements FeedPort (dependency inversion). Uses Node's global fetch; no
 * extra HTTP dependency required.
 */
export class TechForPalestineCasualtiesClient
  implements FeedPort<CasualtiesDailyRow>
{
  async getDailyRows(): Promise<CasualtiesDailyRow[]> {
    const raw = await fetchJson(config.casualtiesFeedUrl, {
      timeoutMs: 15_000,
      label: "Casualties",
    });

    const result = CasualtiesDailySchema.safeParse(raw);
    if (!result.success) {
      throw new ExternalApiError("Casualties feed returned invalid data");
    }
    return Array.isArray(result.data) ? result.data : result.data.data;
  }
}
