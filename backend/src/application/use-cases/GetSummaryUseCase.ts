import type { SummaryFeedPort } from "../../core/ports/SummaryFeedPort.js";
import type { Summary } from "../../core/entities/Summary.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import { SummarySchema } from "../../core/schemas/summary.js";

/**
 * GetSummaryUseCase — orchestrates fetching and validating the current summary.
 *
 * Depends only on the SummaryFeedPort (dependency inversion). Validates the
 * raw upstream payload against the Zod contract at the application boundary,
 * so an unexpected upstream shape surfaces as a controlled ExternalApiError
 * instead of leaking malformed data through the API.
 */
export class GetSummaryUseCase {
  private readonly feed: SummaryFeedPort;

  constructor(feed: SummaryFeedPort) {
    this.feed = feed;
  }

  async execute(): Promise<Summary> {
    const raw = await this.feed.getSummary();

    const parsed = SummarySchema.safeParse(raw);
    if (!parsed.success) {
      throw new ExternalApiError(
        `Summary feed failed contract validation: ${parsed.error.message}`,
      );
    }

    return parsed.data;
  }
}
