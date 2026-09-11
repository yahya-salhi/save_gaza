/**
 * FeedPort — abstract interface for a TechForPalestine daily-rows feed.
 *
 * Collapses the former `CasualtiesFeedPort` / `WestBankFeedPort` pair, which
 * were the identical shape modulo row type (one adapter per seam each — a
 * hypothetical seam twice over). The application use case depends on this
 * port (dependency inversion); the infrastructure layer supplies the
 * TechForPalestine v2 adapter. Rows arrive validated — parsing is owned by
 * the adapter, so the use case never re-validates.
 */
export interface FeedPort<Row> {
  getDailyRows(): Promise<Row[]>;
}
