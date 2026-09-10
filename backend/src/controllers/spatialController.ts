import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { gzipSync } from "node:zlib";
import { successResponse } from "../middlewares/envelope.js";
import { NotFoundError } from "../core/errors/DomainError.js";
import { InMemoryCache } from "../infrastructure/cache/InMemoryCache.js";
import { GAZA_BOUNDARIES } from "../infrastructure/spatial/gazaBoundaries.js";
import type { GazaBoundariesCollection } from "../infrastructure/spatial/gazaBoundaries.js";
import {
  getRegionMeta,
  type RegionMeta,
} from "../infrastructure/spatial/gazaRegions.js";

/** Cache key for the static boundary payload. */
export const BOUNDARIES_CACHE_KEY = "spatial:boundaries:v1";

/** Fresh TTL: 24 hours per the endpoint catalog (static GeoJSON). */
export const BOUNDARIES_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export const boundariesCache = new InMemoryCache();

/** Cache key prefix for static region metadata (full key appends the id). */
export const REGIONS_CACHE_KEY_PREFIX = "spatial:regions:v1:";

/** Fresh TTL: 24 hours — region metadata is static like the boundaries. */
export const REGIONS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export const regionsCache = new InMemoryCache();

function getRegion(id: string): RegionMeta {
  const cached = regionsCache.get<RegionMeta>(REGIONS_CACHE_KEY_PREFIX + id);
  if (cached) return cached;
  const region = getRegionMeta(id);
  if (!region) throw new NotFoundError(`Unknown governorate: ${id}`);
  regionsCache.set(REGIONS_CACHE_KEY_PREFIX + id, region, REGIONS_CACHE_TTL_MS);
  return region;
}

/**
 * Shared enveloped JSON sender — 24h public cache headers with manual
 * gzip negotiation (no extra dependency; static payloads are tiny).
 */
function sendCachedJson(req: Request, res: Response, data: unknown): void {
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
}

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
 * (+ GET /api/v1/spatial/regions/:id below)
 *
 * Gaza-only (Slices 4.1–4.2) static GeoJSON governorate polygons inside the
 * standard `{ success, data, error, timestamp }` envelope. Served from a
 * 24h in-memory cache with `Cache-Control: public, max-age=86400`.
 * Gzip-negotiated manually (no extra dependency — static payload is tiny).
 */
const router = Router();

router.get(
  "/boundaries",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      sendCachedJson(req, res, getBoundaries());
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/v1/spatial/regions/:id — static per-governorate metadata.
 *
 * Identity + curated pre-war overview (area, 2017 census population,
 * admin centre, localities, blurb — all PCBS-sourced, labelled in the
 * payload). No casualty or damage figures exist per governorate upstream,
 * so none are served. Unknown ids throw NotFoundError → 404 envelope via
 * the global error middleware.
 */
router.get(
  "/regions/:id",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (typeof id !== "string") {
        throw new NotFoundError(`Unknown governorate: ${String(id)}`);
      }
      sendCachedJson(req, res, getRegion(id));
    } catch (err) {
      next(err);
    }
  },
);

export const spatialRouter = router;
