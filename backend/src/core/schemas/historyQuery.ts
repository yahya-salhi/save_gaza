import { z } from "zod";

/**
 * Zod runtime contract for `GET /api/v1/statistics/history` query params.
 *
 * Slice 3.4 is Gaza-only: the controller pins `region` to `GAZA_REGION`, so
 * no region param is accepted. Dates are optional — the controller defaults
 * to the trailing 90-day window. `page`/`limit` paginate distinct report
 * dates (ascending), not EAV rows.
 */

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)");

export const HistoryQuerySchema = z
  .object({
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(1000).default(100),
  })
  .refine((q) => !q.startDate || !q.endDate || q.startDate <= q.endDate, {
    message: "startDate must not be after endDate",
    path: ["startDate"],
  });

export type HistoryQuery = z.infer<typeof HistoryQuerySchema>;
