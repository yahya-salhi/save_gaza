import type { IncidentPin } from "../entities/Incident.js";
import type { BboxTuple } from "../schemas/pinsQuery.js";

/**
 * IncidentRepositoryPort — abstract interface for APPROVED incident pins.
 *
 * Infrastructure supplies the Prisma implementation; the application
 * use case depends only on this port (dependency inversion). The Redis
 * bbox-cache seam for Slice 4.4 sits above this port, so the swap never
 * touches the controller or the use case.
 */
export interface IncidentRepositoryPort {
  /**
   * APPROVED pins, optionally filtered to the bbox
   * `[minLng, minLat, maxLng, maxLat]`. Returns at most `PINS_LIMIT`
   * rows ordered by `reportDate` ascending.
   */
  getApprovedPins(bbox?: BboxTuple): Promise<IncidentPin[]>;
}
