/**
 * Incident domain entity — Slice 4.3 pins contract.
 *
 * The Prisma `Incident` table holds user-submitted reports with
 * `PENDING | APPROVED | REJECTED` status (moderation lands in Phase 5).
 * The public pins endpoint serves APPROVED rows only, projected to the
 * minimal marker contract — moderation-detail fields (`description`,
 * `sourceUrl`, `evidenceUrl`) are never exposed on the map.
 */

/** Only APPROVED incidents ever appear as map pins. */
export const APPROVED_STATUS = "APPROVED";

/** Hard cap: one bbox query never returns more than this many pins. */
export const PINS_LIMIT = 500;

/**
 * Minimal public marker contract for `GET /api/v1/incidents/pins`.
 * `status` is always APPROVED by definition, so it is omitted.
 */
export interface IncidentPin {
  id: string;
  title: string;
  reportDate: string;
  region: string;
  latitude: number;
  longitude: number;
}

export interface PinsResult {
  items: IncidentPin[];
  total: number;
}
