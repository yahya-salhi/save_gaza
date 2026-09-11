import { describe, it, expect } from "vitest";
import {
  GetHistoryUseCase,
  shiftDate,
  toHistoryItem,
} from "./GetHistoryUseCase.js";
import type {
  StatisticRepositoryPort,
  StatisticSnapshot,
} from "../../core/ports/StatisticRepositoryPort.js";

function snapshot(
  reportDate: string,
  metrics: Record<string, number> = {},
  reportPeriod?: number,
): StatisticSnapshot {
  return { reportDate, reportPeriod, metrics };
}

function repoWith(days: StatisticSnapshot[]): StatisticRepositoryPort {
  return {
    upsertMetric: () => Promise.resolve(),
    getLatest: () => Promise.resolve(null),
    getHistory: (_region, startDate, endDate, offset, limit) =>
      Promise.resolve(
        days
          .filter((d) => d.reportDate >= startDate && d.reportDate <= endDate)
          .slice(offset, offset + limit),
      ),
    countHistoryDates: (_region, startDate, endDate) =>
      Promise.resolve(
        days.filter((d) => d.reportDate >= startDate && d.reportDate <= endDate)
          .length,
      ),
  };
}

const SEED = [
  snapshot("2026-09-07", { killed_cum: 72800, _report_source: 0 }, 65),
  snapshot("2026-09-08", { killed_cum: 72850, _report_source: 0 }, 66),
  snapshot("2026-09-09", { killed_cum: 73000, _report_source: 0 }, 67),
];

describe("shiftDate", () => {
  it("shifts across month boundaries in UTC", () => {
    expect(shiftDate("2026-09-09", -90)).toBe("2026-06-11");
    expect(shiftDate("2026-01-01", -1)).toBe("2025-12-31");
  });
});

describe("toHistoryItem", () => {
  it("flattens snapshots and hides _-prefixed bookkeeping", () => {
    expect(toHistoryItem(SEED[0]!)).toEqual({
      report_date: "2026-09-07",
      report_period: 65,
      killed_cum: 72800,
    });
  });

  it("omits report_period when absent", () => {
    expect(toHistoryItem(snapshot("2026-09-07", { killed_cum: 1 }))).toEqual({
      report_date: "2026-09-07",
      killed_cum: 1,
    });
  });
});

describe("GetHistoryUseCase", () => {
  it("getPage returns paginated items with total", async () => {
    const useCase = new GetHistoryUseCase(repoWith(SEED));
    const page = await useCase.getPage(
      "2026-09-07",
      "2026-09-09",
      2,
      1,
    );
    expect(page).toEqual({
      items: [
        { report_date: "2026-09-08", report_period: 66, killed_cum: 72850 },
      ],
      page: 2,
      limit: 1,
      total: 3,
    });
  });

  it("getPage defaults to the trailing 90-day window", async () => {
    const useCase = new GetHistoryUseCase(repoWith(SEED));
    const window = useCase.resolveWindow(undefined, "2026-09-09");
    expect(window).toEqual({
      startDate: "2026-06-11",
      endDate: "2026-09-09",
    });
    const page = await useCase.getPage(undefined, "2026-09-09");
    expect(page.total).toBe(3);
  });

  it("getAll loads the whole window in order", async () => {
    const useCase = new GetHistoryUseCase(repoWith(SEED));
    const result = await useCase.getAll("2026-09-07", "2026-09-09");
    expect(result.startDate).toBe("2026-09-07");
    expect(result.endDate).toBe("2026-09-09");
    expect(result.items.map((i) => i.report_date)).toEqual([
      "2026-09-07",
      "2026-09-08",
      "2026-09-09",
    ]);
  });

  it("getAll returns empty items for a window with no data", async () => {
    const useCase = new GetHistoryUseCase(repoWith(SEED));
    const result = await useCase.getAll("2020-01-01", "2020-01-31");
    expect(result.items).toEqual([]);
  });
});
