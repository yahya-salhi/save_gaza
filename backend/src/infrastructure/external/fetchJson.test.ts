import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchJson } from "./fetchJson.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

function jsonResponse(
  body: unknown,
  ok = true,
  status = 200,
  statusText = "OK",
) {
  return {
    ok,
    status,
    statusText,
    json: vi.fn().mockResolvedValue(body),
  };
}

describe("fetchJson", () => {
  it("returns the parsed body and sends Accept + timeout", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ report_date: "2026-09-09" }));
    vi.stubGlobal("fetch", fetchMock);

    const body = await fetchJson("https://example.test/feed.json", {
      timeoutMs: 15_000,
      label: "Casualties",
    });

    expect(body).toEqual({ report_date: "2026-09-09" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://example.test/feed.json");
    expect(init.headers).toEqual({ Accept: "application/json" });
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("maps transport failures to a labeled 502", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("socket hang up")),
    );

    await expect(
      fetchJson("https://example.test/feed.json", {
        timeoutMs: 15_000,
        label: "Casualties",
      }),
    ).rejects.toMatchObject({
      message: "Casualties feed request failed: socket hang up",
    });
    await expect(
      fetchJson("https://example.test/feed.json", {
        timeoutMs: 15_000,
        label: "Casualties",
      }),
    ).rejects.toBeInstanceOf(ExternalApiError);
  });

  it("maps non-2xx statuses to a labeled 502", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503, "Service Unavailable")),
    );

    await expect(
      fetchJson("https://example.test/feed.json", {
        timeoutMs: 15_000,
        label: "West Bank",
      }),
    ).rejects.toMatchObject({
      message: "West Bank feed returned 503 Service Unavailable",
    });
  });

  it("maps unparseable bodies to a labeled 502", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: vi.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
    }));

    await expect(
      fetchJson("https://example.test/feed.json", {
        timeoutMs: 10_000,
        label: "Summary",
      }),
    ).rejects.toMatchObject({
      message: "Summary feed returned invalid JSON",
    });
  });
});
