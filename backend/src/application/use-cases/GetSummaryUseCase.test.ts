import { describe, it, expect, vi } from "vitest";
import { GetSummaryUseCase } from "./GetSummaryUseCase.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import type { SummaryFeedPort } from "../../core/ports/SummaryFeedPort.js";
import type { Summary } from "../../core/entities/Summary.js";

const validSummary: Summary = {
  gaza: {
    reports: 1067,
    last_update: "2026-09-07",
    massacres: 12000,
    killed: {
      total: 73658,
      children: 20179,
      women: 12500,
      civil_defence: 140,
      press: 262,
      medical: 1701,
    },
    famine: {},
    aid_seeker: {},
    injured: { total: 174622 },
  },
  west_bank: {
    reports: 1067,
    last_update: "2026-09-07",
    settler_attacks: 4554,
    killed: { total: 1114, children: 238 },
    injured: { total: 11625, children: 1913 },
  },
  lebanon: {
    reports: 193,
    first_report: "2023-11-14",
    last_update: "2026-09-06",
    killed: { total: 8409 },
    injured: { total: 29016 },
  },
  known_killed_in_gaza: {
    records: 72835,
    pages: 729,
    page_size: 100,
    male: { adult: 36067, senior: 2089, child: 12803 },
    female: { adult: 11733, senior: 1309, child: 8834 },
    last_update: "2026-07-27",
    includes_until: "2026-05-07",
  },
  known_press_killed_in_gaza: { records: 262 },
};

function createFeed(returnValue: unknown): SummaryFeedPort {
  return {
    getSummary: vi.fn().mockResolvedValue(returnValue),
  };
}

describe("GetSummaryUseCase", () => {
  it("returns a valid summary payload", async () => {
    const useCase = new GetSummaryUseCase(createFeed(validSummary));
    const result = await useCase.execute();
    expect(result.gaza.killed.total).toBe(73658);
    expect(result.known_press_killed_in_gaza.records).toBe(262);
  });

  it("throws ExternalApiError when the payload fails contract validation", async () => {
    const malformed = { gaza: { killed: { total: "nope" } } };
    const useCase = new GetSummaryUseCase(createFeed(malformed));
    await expect(useCase.execute()).rejects.toBeInstanceOf(ExternalApiError);
  });
});
