import { describe, it, expect, vi, afterEach } from "vitest";
import {
  buildExportEndpoint,
  parseExportFilename,
  fallbackExportFilename,
  downloadHistoryExport,
} from "./export.js";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("buildExportEndpoint", () => {
  it("encodes the window and format into the query string", () => {
    expect(
      buildExportEndpoint({
        startDate: "2026-06-01",
        endDate: "2026-09-09",
        format: "json",
      }),
    ).toBe(
      "/api/v1/statistics/export?startDate=2026-06-01&endDate=2026-09-09&format=json",
    );
  });

  it("defaults to csv and omits undefined dates", () => {
    expect(buildExportEndpoint()).toBe("/api/v1/statistics/export?format=csv");
  });
});

describe("parseExportFilename", () => {
  it("reads a quoted disposition filename", () => {
    expect(
      parseExportFilename(
        'attachment; filename="gaza-history-2026-06-01-to-2026-09-09.csv"',
        "fallback.csv",
      ),
    ).toBe("gaza-history-2026-06-01-to-2026-09-09.csv");
  });

  it("falls back when the header is missing", () => {
    expect(parseExportFilename(null, "fallback.csv")).toBe("fallback.csv");
  });
});

describe("fallbackExportFilename", () => {
  it("names the file after the window", () => {
    expect(
      fallbackExportFilename({
        startDate: "2026-06-01",
        endDate: "2026-09-09",
        format: "json",
      }),
    ).toBe("gaza-history-2026-06-01-to-2026-09-09.json");
  });
});

function blobResponse({ ok = true, status = 200, disposition = null, errorBody = null } = {}) {
  const headers = new Headers();
  if (disposition) headers.set("Content-Disposition", disposition);
  return {
    ok,
    status,
    headers,
    json: vi.fn().mockResolvedValue(errorBody ?? {}),
    blob: vi.fn().mockResolvedValue(new Blob(["a,b\n1,2\n"], { type: "text/csv" })),
  };
}

describe("downloadHistoryExport", () => {
  it("fetches the window URL and saves the blob via an anchor click", async () => {
    const res = blobResponse({
      disposition: 'attachment; filename="gaza-history-2026-09-06-to-2026-09-09.csv"',
    });
    const fetchMock = vi.fn().mockResolvedValue(res);
    vi.stubGlobal("fetch", fetchMock);
    const createObjectURL = vi.fn().mockReturnValue("blob:mock");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });

    const click = vi.fn();
    const anchor = { click, remove: vi.fn(), href: "", download: "" };
    vi.spyOn(document, "createElement").mockReturnValue(anchor);
    vi.spyOn(document.body, "appendChild").mockImplementation(() => anchor);

    const filename = await downloadHistoryExport({
      startDate: "2026-09-06",
      endDate: "2026-09-09",
      format: "csv",
    });

    expect(filename).toBe("gaza-history-2026-09-06-to-2026-09-09.csv");
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/api/v1/statistics/export?startDate=2026-09-06&endDate=2026-09-09&format=csv",
    );
    expect(anchor.download).toBe("gaza-history-2026-09-06-to-2026-09-09.csv");
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("throws the envelope message without saving when the response is not ok", async () => {
    const res = blobResponse({
      ok: false,
      status: 400,
      errorBody: {
        success: false,
        data: null,
        error: { code: "VALIDATION_ERROR", message: "Bad format" },
      },
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(res));
    const click = vi.fn();
    vi.spyOn(document, "createElement").mockReturnValue({
      click,
      remove: vi.fn(),
      href: "",
      download: "",
    });

    await expect(downloadHistoryExport({ format: "csv" })).rejects.toThrow(
      "Bad format",
    );
    expect(click).not.toHaveBeenCalled();
  });
});
