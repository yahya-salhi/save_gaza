import { z } from "zod";

/**
 * Zod runtime contract for the TechForPalestine v2 `west_bank_daily.json` feed.
 *
 * Each row carries `report_date` plus a sparse set of verified cumulative
 * counters and a `flash_source` provenance string. Early rows may nest a
 * legacy `verified` object (passthrough — never validated or persisted);
 * later rows add settler-attack and displacement counters, so every metric
 * stays optional. There is no arrests feed in v2 — arrests are out of scope.
 */

const nonnegative = z.number().int().nonnegative();

const WestBankDailyRowSchema = z
  .object({
    report_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    flash_source: z.string().min(1).optional(),
    killed_cum: nonnegative.optional(),
    killed_children_cum: nonnegative.optional(),
    injured_cum: nonnegative.optional(),
    injured_children_cum: nonnegative.optional(),
    settler_attacks_cum: nonnegative.optional(),
    displaced_households_cum: nonnegative.optional(),
    displaced_persons_cum: nonnegative.optional(),
    displaced_children_cum: nonnegative.optional(),
  })
  .passthrough();

const RowArraySchema = z.array(WestBankDailyRowSchema).min(1);

const EnvelopeSchema = z.object({ data: RowArraySchema }).passthrough();

export const WestBankDailySchema = z.union([EnvelopeSchema, RowArraySchema]);

export type WestBankDailyRow = z.infer<typeof WestBankDailyRowSchema>;
