import type {
  IncidentRepositoryPort,
} from "../../core/ports/IncidentRepositoryPort.js";
import type { PinsResult } from "../../core/entities/Incident.js";
import type { BboxTuple } from "../../core/schemas/pinsQuery.js";
import { PINS_LIMIT } from "../../core/entities/Incident.js";

/**
 * GetIncidentPinsUseCase — APPROVED incident pins for the map.
 *
 * Single responsibility: read APPROVED rows through the repository port
 * (optional bbox filter) and shape the `{ items, total }` payload. The
 * repository enforces the `PINS_LIMIT` cap; the use case re-asserts it so
 * the contract holds regardless of adapter.
 */
export class GetIncidentPinsUseCase {
  constructor(private readonly repo: IncidentRepositoryPort) {}

  async execute(bbox?: BboxTuple): Promise<PinsResult> {
    const pins = await this.repo.getApprovedPins(bbox);
    const items = pins.slice(0, PINS_LIMIT);
    return { items, total: items.length };
  }
}
