import { describe, it, expect, vi, afterEach } from "vitest";
import { TechForPalestineSummaryClient } from "./TechForPalestineSummaryClient.js";
import { config } from "../../config.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("TechForPalestineSummaryClient", () => {
  it("fetches the configured URL and passes the payload through raw", async () => {
    const payload = { gaza: { killed: { total: 73000 } } };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: vi.fn().mockResolvedValue(payload),
    });
    vi.stubGlobal("fetch", fetchMock);

    const summary = await new TechForPalestineSummaryClient().getSummary();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(config.summaryFeedUrl);
    // Validation stays in GetSummaryUseCase — the adapter passes through.
    expect(summary).toEqual(payload);
  });
});
