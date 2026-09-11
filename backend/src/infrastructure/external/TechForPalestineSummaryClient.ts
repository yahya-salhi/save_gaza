import type { SummaryFeedPort } from "../../core/ports/SummaryFeedPort.js";
import type { Summary } from "../../core/entities/Summary.js";
import { config } from "../../config.js";
import { fetchJson } from "./fetchJson.js";

/**
 * TechForPalestineSummaryClient — external adapter that fetches the current
 * summary from the TechForPalestine v3 `summary.json` feed.
 *
 * Thin config adapter over the shared `fetchJson` transport: URL, timeout,
 * and label travel here; fetching, timeout, and 502 mapping live in the
 * module. Returns the raw JSON payload — validation stays in
 * `GetSummaryUseCase`, which owns the Summary contract at the application
 * boundary.
 *
 * Implements the SummaryFeedPort (dependency inversion). Uses Node's global
 * fetch; no extra HTTP dependency required.
 */
export class TechForPalestineSummaryClient implements SummaryFeedPort {
  async getSummary(): Promise<Summary> {
    const raw = await fetchJson(config.summaryFeedUrl, {
      timeoutMs: 10_000,
      label: "Summary",
    });
    return raw as Summary;
  }
}
