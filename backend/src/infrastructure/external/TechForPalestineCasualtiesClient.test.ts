import { describe, it, expect, vi, afterEach } from "vitest";
import { TechForPalestineCasualtiesClient } from "./TechForPalestineCasualtiesClient.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import { config } from "../../config.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

const ROW = {
  report_date: "2026-09-09",
  report_source: "MoH",
  report_period: 68,
  killed_cum: 73000,
};

function okFetch(body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: "OK",
    json: vi.fn().mockResolvedValue(body),
  });
}

describe("TechForPalestineCasualtiesClient", () => {
  it("fetches the configured URL and returns the row array", async () => {
    const fetchMock = okFetch([ROW]);
    vi.stubGlobal("fetch", fetchMock);

    const rows = await new TechForPalestineCasualtiesClient().getDailyRows();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(config.casualtiesFeedUrl);
    expect(rows).toEqual([ROW]);
  });

  it("unwraps the { data } envelope shape", async () => {
    vi.stubGlobal("fetch", okFetch({ data: [ROW] }));

    const rows = await new TechForPalestineCasualtiesClient().getDailyRows();

    expect(rows).toEqual([ROW]);
  });

  it("throws 502 on rows that fail contract validation", async () => {
    vi.stubGlobal("fetch", okFetch([{ report_date: "not-a-date" }]));

    await expect(
      new TechForPalestineCasualtiesClient().getDailyRows(),
    ).rejects.toBeInstanceOf(ExternalApiError);
  });
});
