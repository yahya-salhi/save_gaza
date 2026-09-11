import { describe, it, expect } from "vitest";
import { SyncCasualtiesUseCase } from "./SyncCasualtiesUseCase.js";
import { SyncWestBankUseCase } from "./SyncWestBankUseCase.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import type { StatisticRepositoryPort } from "../../core/ports/StatisticRepositoryPort.js";

/** In-memory fake repo: upserts keyed like the EAV table. */
function fakeRepo() {
  const store = new Map<string, number>();
  const key = (region: string, date: string, type: string) =>
    `${region}:${date}:${type}`;
  const repo: StatisticRepositoryPort & { store: Map<string, number> } = {
    store,
    upsertMetric: (region, date, type, _label, value) => {
      store.set(key(region, date, type), value);
      return Promise.resolve();
    },
    getLatest: (region) => {
      let latest = "";
      for (const k of store.keys()) {
        const [, date] = k.split(":");
        if (k.startsWith(`${region}:`) && date! > latest) latest = date!;
      }
      if (!latest) return Promise.resolve(null);
      const metrics: Record<string, number> = {};
      for (const [k, v] of store.entries()) {
        const [r, d, ...rest] = k.split(":");
        if (r === region && d === latest) metrics[rest.join(":")] = v;
      }
      return Promise.resolve({ reportDate: latest, metrics });
    },
    getHistory: () => Promise.resolve([]),
    countHistoryDates: () => Promise.resolve(0),
  };
  return repo;
}

const GAZA_ROWS = [
  {
    report_date: "2026-09-08",
    report_source: "MoH",
    report_period: 67,
    killed_cum: 72850,
    injured_cum: 173800,
  },
  {
    report_date: "2026-09-09",
    report_source: "MoH",
    report_period: 68,
    killed_cum: 73000,
    injured_cum: 174000,
    press_killed_cum: 260,
  },
];

const WB_ROWS = [
  {
    report_date: "2026-09-08",
    flash_source: "flash-1",
    killed_cum: 1000,
    settler_attacks_cum: 50,
  },
  {
    report_date: "2026-09-09",
    flash_source: "flash-2",
    killed_cum: 1010,
    settler_attacks_cum: 52,
  },
];

describe("SyncCasualtiesUseCase (via shared SyncDailyUseCase)", () => {
  it("persists verified metrics + Gaza extras and returns the latest row", async () => {
    const repo = fakeRepo();
    const useCase = new SyncCasualtiesUseCase(
      { getDailyRows: () => Promise.resolve(GAZA_ROWS) },
      repo,
    );

    const daily = await useCase.execute();

    expect(daily.report_date).toBe("2026-09-09");
    expect(daily.killed_cum).toBe(73000);
    expect(daily.press_killed_cum).toBe(260);
    expect(daily.report_source).toBe("MoH");
    expect(daily.report_period).toBe(68);
    // Verified metrics persisted per row…
    expect(repo.store.get("gaza:2026-09-09:killed_cum")).toBe(73000);
    expect(repo.store.get("gaza:2026-09-08:killed_cum")).toBe(72850);
    // …plus Gaza-only bookkeeping rows.
    expect(repo.store.get("gaza:2026-09-09:_report_period")).toBe(68);
    expect(repo.store.get("gaza:2026-09-09:_report_source")).toBe(0);
    // Absent metrics are skipped, never written as 0/undefined.
    expect(repo.store.has("gaza:2026-09-08:press_killed_cum")).toBe(false);
  });

  it("picks the max report_date, not the last element", async () => {
    const repo = fakeRepo();
    const useCase = new SyncCasualtiesUseCase(
      { getDailyRows: () => Promise.resolve([...GAZA_ROWS].reverse()) },
      repo,
    );

    const daily = await useCase.execute();
    expect(daily.report_date).toBe("2026-09-09");
  });

  it("throws 502 on empty feed", async () => {
    const useCase = new SyncCasualtiesUseCase(
      { getDailyRows: () => Promise.resolve([]) },
      fakeRepo(),
    );
    await expect(useCase.execute()).rejects.toBeInstanceOf(ExternalApiError);
  });

  it("throws 502 when persistence verification fails", async () => {
    const repo = fakeRepo();
    repo.getLatest = () => Promise.resolve(null);
    const useCase = new SyncCasualtiesUseCase(
      { getDailyRows: () => Promise.resolve(GAZA_ROWS) },
      repo,
    );
    await expect(useCase.execute()).rejects.toThrow(
      "Failed to read persisted Gaza statistics",
    );
  });
});

describe("SyncWestBankUseCase (via shared SyncDailyUseCase)", () => {
  it("persists metrics with no extras and carries flash_source", async () => {
    const repo = fakeRepo();
    const useCase = new SyncWestBankUseCase(
      { getDailyRows: () => Promise.resolve(WB_ROWS) },
      repo,
    );

    const daily = await useCase.execute();

    expect(daily.report_date).toBe("2026-09-09");
    expect(daily.flash_source).toBe("flash-2");
    expect(daily.killed_cum).toBe(1010);
    expect(repo.store.get("west_bank:2026-09-09:killed_cum")).toBe(1010);
    // West Bank writes no bookkeeping rows.
    expect(
      [...repo.store.keys()].some((k) => k.includes("_report_")),
    ).toBe(false);
  });

  it("throws 502 on empty feed", async () => {
    const useCase = new SyncWestBankUseCase(
      { getDailyRows: () => Promise.resolve([]) },
      fakeRepo(),
    );
    await expect(useCase.execute()).rejects.toBeInstanceOf(ExternalApiError);
  });
});
