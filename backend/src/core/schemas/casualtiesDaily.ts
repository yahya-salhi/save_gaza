import { z } from "zod";

/**
 * Zod runtime contract for the TechForPalestine v2 `casualties_daily.json` feed.
 *
 * Each row carries `report_date` / `report_source` / `report_period` meta plus
 * a sparse set of verified cumulative counters. `ext_*` extrapolated fields
 * are allowed upstream (passthrough) but never validated or persisted — the
 * use case picks only the verified keys. Later rows may carry truce /
 * committee / famine / aid-seeker fields that early rows lack, so every
 * metric stays optional.
 */

const nonnegative = z.number().int().nonnegative();

const CasualtiesDailyRowSchema = z
  .object({
    report_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    report_source: z.string().min(1),
    report_period: z.number().int().nonnegative(),
    massacres_cum: nonnegative.optional(),
    killed: nonnegative.optional(),
    killed_cum: nonnegative.optional(),
    killed_children_cum: nonnegative.optional(),
    killed_women_cum: nonnegative.optional(),
    killed_recovered: nonnegative.optional(),
    killed_succumbed: nonnegative.optional(),
    killed_truce_new: nonnegative.optional(),
    killed_committee: nonnegative.optional(),
    child_famine_cum: nonnegative.optional(),
    famine_cum: nonnegative.optional(),
    aid_seeker_killed_cum: nonnegative.optional(),
    aid_seeker_injured_cum: nonnegative.optional(),
    injured: nonnegative.optional(),
    injured_cum: nonnegative.optional(),
    civdef_killed_cum: nonnegative.optional(),
    med_killed_cum: nonnegative.optional(),
    press_killed_cum: nonnegative.optional(),
  })
  .passthrough();

const RowArraySchema = z.array(CasualtiesDailyRowSchema).min(1);

const EnvelopeSchema = z.object({ data: RowArraySchema }).passthrough();

export const CasualtiesDailySchema = z.union([EnvelopeSchema, RowArraySchema]);

export type CasualtiesDailyRow = z.infer<typeof CasualtiesDailyRowSchema>;
