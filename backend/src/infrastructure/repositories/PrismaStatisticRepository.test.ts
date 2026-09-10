import "dotenv/config";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaStatisticRepository } from "./PrismaStatisticRepository.js";

/**
 * PrismaStatisticRepository integration test — runs against the LIVE database
 * (Slice 3.2.1: `docker compose up -d postgres` + baseline migration).
 *
 * Uses an isolated `itest-*` region so real Gaza rows are never touched.
 * Skips cleanly when no database is reachable (e.g. CI without Postgres).
 */
const dbAvailable: boolean = await (async () => {
  try {
    const { prisma } = await import("../database/prismaClient.js");
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
})();

describe.skipIf(!dbAvailable)("PrismaStatisticRepository (live DB)", () => {
  const repo = new PrismaStatisticRepository();
  const region = "itest-gaza";

  async function cleanup(): Promise<void> {
    const { prisma } = await import("../database/prismaClient.js");
    await prisma.statistic.deleteMany({ where: { region } });
  }

  beforeAll(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
  });

  it("upserts metrics and returns the latest-date snapshot", async () => {
    await repo.upsertMetric(region, "2026-01-01", "killed_cum", "Total killed", 100);
    await repo.upsertMetric(region, "2026-01-02", "killed_cum", "Total killed", 150);
    await repo.upsertMetric(region, "2026-01-02", "injured_cum", "Total injured", 300);

    const snapshot = await repo.getLatest(region);

    expect(snapshot).not.toBeNull();
    expect(snapshot!.reportDate).toBe("2026-01-02");
    expect(snapshot!.metrics["killed_cum"]).toBe(150);
    expect(snapshot!.metrics["injured_cum"]).toBe(300);
  });

  it("upsert is idempotent on (region, reportDate, type)", async () => {
    await repo.upsertMetric(region, "2026-01-03", "killed_cum", "Total killed", 10);
    await repo.upsertMetric(region, "2026-01-03", "killed_cum", "Total killed", 20);

    const snapshot = await repo.getLatest(region);

    expect(snapshot!.reportDate).toBe("2026-01-03");
    expect(snapshot!.metrics["killed_cum"]).toBe(20);
  });

  it("returns null when the region has no rows", async () => {
    const snapshot = await repo.getLatest("itest-empty-region");
    expect(snapshot).toBeNull();
  });
});
