import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../middlewares/envelope.js";
import { ValidationError } from "../core/errors/DomainError.js";
import { PinsQuerySchema } from "../core/schemas/pinsQuery.js";
import type { BboxTuple } from "../core/schemas/pinsQuery.js";
import { GetIncidentPinsUseCase } from "../application/use-cases/GetIncidentPinsUseCase.js";
import { PrismaIncidentRepository } from "../infrastructure/repositories/PrismaIncidentRepository.js";
import { InMemoryCache } from "../infrastructure/cache/InMemoryCache.js";
import { CachedQuery } from "../infrastructure/cache/CachedQuery.js";

/** Cache key prefix for pins payloads (full key appends the bbox or "all"). */
export const PINS_CACHE_KEY_PREFIX = "incidents:pins:v1:";

/** Fresh TTL: 10 minutes per the endpoint catalog (dynamic user data). */
export const PINS_CACHE_TTL_MS = 10 * 60 * 1000;

export const pinsCache = new InMemoryCache();

/** Shared box over `pinsCache` — TTL + stale live here, keys stay here. */
const pinsQuery = new CachedQuery(pinsCache, "pins");

const pinsUseCase = new GetIncidentPinsUseCase(new PrismaIncidentRepository());

/**
 * Normalize the bbox into a stable cache key. Numbers are fixed to 4dp so
 * `34.20` and `34.2` share one entry; omitted bbox maps to `"all"`.
 */
export function pinsCacheKey(bbox?: BboxTuple): string {
  if (!bbox) return `${PINS_CACHE_KEY_PREFIX}all`;
  return `${PINS_CACHE_KEY_PREFIX}${bbox.map((n) => n.toFixed(4)).join(",")}`;
}

/**
 * incidentsController — GET /api/v1/incidents/pins
 *
 * Slice 4.3: APPROVED-only incident markers with an optional
 * `?bbox=minLng,minLat,maxLng,maxLat` filter, inside the standard
 * `{ success, data: { items, total }, error, timestamp }` envelope.
 * Empty (`{ items: [], total: 0 }`) is valid — moderation (Phase 5) has
 * not landed yet, so no approved rows exist. Invalid bbox is a 400
 * served on a humanitarian map). Per-bbox 10-min cache via the shared
 * `CachedQuery` box over `pinsCache` (uniform stale-while-revalidate); the operational
 * Redis swap sits behind this controller untouched (Slice 6.3).
 * Deliberately no `Cache-Control: public` — pins are dynamic user data,
 * not static GeoJSON.
 */
const router = Router();

router.get("/pins", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = PinsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Invalid query parameters",
      );
    }
    const bbox = parsed.data.bbox;

    const key = pinsCacheKey(bbox);
    const data = await pinsQuery.getOrLoad(key, PINS_CACHE_TTL_MS, () =>
      pinsUseCase.execute(bbox),
    );
    res.json(successResponse(data));
  } catch (err) {
    next(err);
  }
});

export const incidentsRouter = router;
