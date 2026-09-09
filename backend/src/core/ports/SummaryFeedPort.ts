import type { Summary } from "../entities/Summary.js";

/**
 * SummaryFeedPort — abstract interface for fetching the current summary.
 *
 * The application use case depends on this port (dependency inversion); the
 * infrastructure layer supplies the concrete TechForPalestine adapter.
 */
export interface SummaryFeedPort {
  getSummary(): Promise<Summary>;
}
