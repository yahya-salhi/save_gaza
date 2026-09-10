import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { gzipSync } from "node:zlib";
import { successResponse } from "../middlewares/envelope.js";
import { InMemoryCache } from "../infrastructure/cache/InMemoryCache.js";
import { GAZA_BOUNDARIES } from "../infrastructure/spatial/gazaBoundaries.js";
import type { GazaBoundariesCollection } from "../infrastructure/spatial/gazaBoundaries.js";

/** Cache key for the static boundary payload. */
export const BOUNDARIES_CACHE_KEY = "spatial:boundaries:v1";

/** Fresh TTL: 24 hours per the endpoint catalog (static GeoJSON). */
export const BOUNDARIES_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export const boundariesCache = new InMemoryCache();

function getBoundaries(): GazaBoundariesCollection {
  const cached = boundariesCache.get<GazaBoundariesCollection>(
    BOUNDARIES_CACHE_KEY,
  );
  if (cached) return cached;
  boundariesCache.set(
    BOUNDARIES_CACHE_KEY,
    GAZA_BOUNDARIES,
    BOUNDARIES_CACHE_TTL_MS,
  );
  return GAZA_BOUNDARIES;
}

/**
 * spatialController — GET /api/v1/spatial/boundaries
 *
 * Gaza-only (Slice 4.1) static GeoJSON governorate polygons inside the
 * standard `{ success, data, error, timestamp }` envelope. Served from a
 * 24h in-memory cache with `Cache-Control: public, max-age=86400`.
 * Gzip-negotiated manually (no extra dependency — static payload is tiny).
 */
const router = Router();

router.get(
  "/boundaries",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = getBoundaries();
      const body = JSON.stringify(successResponse(data));

      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Vary", "Accept-Encoding");

      const acceptsGzip =
        typeof req.headers["accept-encoding"] === "string" &&
        req.headers["accept-encoding"].includes("gzip");
      if (acceptsGzip) {
        const gzipped = gzipSync(body);
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Length", String(gzipped.length));
        res.send(gzipped);
        return;
      }

      res.type("application/json").send(body);
    } catch (err) {
      next(err);
    }
  },
);

export const spatialRouter = router;
