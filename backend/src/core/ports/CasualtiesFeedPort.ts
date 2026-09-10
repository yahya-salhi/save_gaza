import type { CasualtiesDailyRow } from "../schemas/casualtiesDaily.js";

/**
 * CasualtiesFeedPort — abstract interface for the Gaza daily feed.
 *
 * The application use case depends on this port (dependency inversion); the
 * infrastructure layer supplies the TechForPalestine v2 adapter. Returns the
 * raw upstream rows for the use case to validate.
 */
export interface CasualtiesFeedPort {
  getDailyRows(): Promise<CasualtiesDailyRow[]>;
}
