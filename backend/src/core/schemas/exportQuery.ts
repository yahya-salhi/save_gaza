import { z } from "zod";

/**
 * Zod runtime contract for `GET /api/v1/statistics/export` query params.
 *
 * Slice 3.5 is Gaza-only: the controller pins `region` to `GAZA_REGION`, so
 * no region param is accepted. Dates are optional — the controller defaults
 * to the trailing 90-day window, mirroring `history`. The whole window is
 * returned in one file (no pagination). `format` defaults to `csv`.
 */

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)");

export const ExportQuerySchema = z
  .object({
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    format: z.enum(["csv", "json"]).default("csv"),
  })
  .refine((q) => !q.startDate || !q.endDate || q.startDate <= q.endDate, {
    message: "startDate must not be after endDate",
    path: ["startDate"],
  });

export type ExportQuery = z.infer<typeof ExportQuerySchema>;
