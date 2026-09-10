import type { WestBankDailyRow } from "../schemas/westBankDaily.js";

/**
 * WestBankFeedPort — abstract interface for the West Bank daily feed.
 *
 * Infrastructure supplies the TechForPalestine implementation; the
 * application use case depends only on this port (dependency inversion).
 */
export interface WestBankFeedPort {
  getDailyRows(): Promise<WestBankDailyRow[]>;
}
