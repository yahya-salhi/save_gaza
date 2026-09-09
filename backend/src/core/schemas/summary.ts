import { z } from "zod";

/**
 * Zod runtime contract for the TechForPalestine v3 `summary.json` feed.
 *
 * Validates the external adapter's raw upstream payload at the application
 * boundary, guaranteeing the controller only ever relays a shape that matches
 * the documented `/api/v1/summary` contract.
 */

const CasualtyBreakdownSchema = z.object({
  total: z.number().int().nonnegative(),
  children: z.number().int().nonnegative().optional(),
  women: z.number().int().nonnegative().optional(),
  civil_defence: z.number().int().nonnegative().optional(),
  press: z.number().int().nonnegative().optional(),
  medical: z.number().int().nonnegative().optional(),
});

const GazaSummarySchema = z.object({
  reports: z.number().int().nonnegative(),
  last_update: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  massacres: z.number().int().nonnegative(),
  killed: CasualtyBreakdownSchema,
  famine: z.record(z.string(), z.unknown()).default({}),
  aid_seeker: z.record(z.string(), z.unknown()).default({}),
  injured: z.object({ total: z.number().int().nonnegative() }),
});

const WestBankSummarySchema = z.object({
  reports: z.number().int().nonnegative(),
  last_update: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  settler_attacks: z.number().int().nonnegative(),
  killed: z.object({
    total: z.number().int().nonnegative(),
    children: z.number().int().nonnegative(),
  }),
  injured: z.object({
    total: z.number().int().nonnegative(),
    children: z.number().int().nonnegative(),
  }),
});

const LebanonSummarySchema = z.object({
  reports: z.number().int().nonnegative(),
  first_report: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  last_update: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  killed: z.object({ total: z.number().int().nonnegative() }),
  injured: z.object({ total: z.number().int().nonnegative() }),
});

const KnownKilledInGazaSchema = z.object({
  records: z.number().int().nonnegative(),
  pages: z.number().int().nonnegative(),
  page_size: z.number().int().nonnegative(),
  male: z.object({
    adult: z.number().int().nonnegative(),
    senior: z.number().int().nonnegative(),
    child: z.number().int().nonnegative(),
  }),
  female: z.object({
    adult: z.number().int().nonnegative(),
    senior: z.number().int().nonnegative(),
    child: z.number().int().nonnegative(),
  }),
  last_update: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  includes_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const KnownPressKilledInGazaSchema = z.object({
  records: z.number().int().nonnegative(),
});

export const SummarySchema = z.object({
  gaza: GazaSummarySchema,
  west_bank: WestBankSummarySchema,
  lebanon: LebanonSummarySchema,
  known_killed_in_gaza: KnownKilledInGazaSchema,
  known_press_killed_in_gaza: KnownPressKilledInGazaSchema,
});

export type SummaryDto = z.infer<typeof SummarySchema>;
