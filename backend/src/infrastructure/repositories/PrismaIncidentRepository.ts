import type {
  IncidentRepositoryPort,
} from "../../core/ports/IncidentRepositoryPort.js";
import type { IncidentPin } from "../../core/entities/Incident.js";
import type { BboxTuple } from "../../core/schemas/pinsQuery.js";
import {
  APPROVED_STATUS,
  PINS_LIMIT,
} from "../../core/entities/Incident.js";

/**
 * PrismaIncidentRepository — Prisma implementation of IncidentRepositoryPort.
 *
 * Reads APPROVED rows from the existing `incidents` table (no migration —
 * `@@index([status])` covers the unfiltered query). Bbox filtering is a
 * lat/lng range predicate. Only the public marker fields are selected —
 * `description`, `sourceUrl`, and `evidenceUrl` never leave the database.
 */
export class PrismaIncidentRepository implements IncidentRepositoryPort {
  /**
   * Lazily import Prisma so tests can mock
   * `../../infrastructure/database/prismaClient.js`.
   */
  private async prisma() {
    const { prisma } = await import("../../infrastructure/database/prismaClient.js");
    return prisma;
  }

  async getApprovedPins(bbox?: BboxTuple): Promise<IncidentPin[]> {
    const db = await this.prisma();
    const rows = await db.incident.findMany({
      where: {
        status: APPROVED_STATUS,
        ...(bbox
          ? {
              longitude: { gte: bbox[0], lte: bbox[2] },
              latitude: { gte: bbox[1], lte: bbox[3] },
            }
          : {}),
      },
      select: {
        id: true,
        title: true,
        reportDate: true,
        region: true,
        latitude: true,
        longitude: true,
      },
      orderBy: { reportDate: "asc" },
      take: PINS_LIMIT,
    });

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      reportDate: row.reportDate.toISOString().slice(0, 10),
      region: row.region,
      latitude: row.latitude,
      longitude: row.longitude,
    }));
  }
}
