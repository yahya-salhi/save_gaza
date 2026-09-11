import { z } from "zod";

/**
 * Zod runtime contract for `GET /api/v1/incidents/pins` query params.
 *
 * Slice 4.3: `bbox` is optional — omitted means "all approved pins".
 * When present it must be exactly `minLng,minLat,maxLng,maxLat` with
 * `min < max` on each axis. Anything else is a 400 `VALIDATION_ERROR`
 * via the controller (never silent clamping — clamping hides caller bugs).
 */

const lng = z.number().min(-180).max(180);
const lat = z.number().min(-90).max(90);

const bboxTuple = z
  .tuple([lng, lat, lng, lat])
  .refine(([minLng, , maxLng]) => minLng < maxLng, {
    message: "bbox minLng must be less than maxLng",
    path: ["bbox"],
  })
  .refine(([, minLat, , maxLat]) => minLat < maxLat, {
    message: "bbox minLat must be less than maxLat",
    path: ["bbox"],
  });

export const PinsQuerySchema = z.object({
  bbox: z
    .string()
    .optional()
    .transform((raw, ctx) => {
      if (raw === undefined || raw === "") return undefined;
      const parts = raw.split(",").map((p) => Number(p.trim()));
      if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
        ctx.addIssue({
          code: "custom",
          message:
            "bbox must be four comma-separated numbers: minLng,minLat,maxLng,maxLat",
        });
        return z.NEVER;
      }
      const parsed = bboxTuple.safeParse(parts);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          ctx.addIssue(issue);
        }
        return z.NEVER;
      }
      return parsed.data;
    }),
});

export type PinsQuery = z.infer<typeof PinsQuerySchema>;

/** `[minLng, minLat, maxLng, maxLat]` tuple, or undefined when unfiltered. */
export type BboxTuple = z.infer<typeof bboxTuple>;
