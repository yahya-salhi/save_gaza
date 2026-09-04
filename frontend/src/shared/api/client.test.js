import { describe, it, expect, vi, afterEach } from "vitest";
import { apiGet } from "../api/client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiGet envelope unwrapping", () => {
  it("returns data on success envelope", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      async json() {
        return {
          success: true,
          data: { kills: 1 },
          error: null,
          timestamp: "2026-09-04T00:00:00.000Z",
        };
      },
    }));

    const data = await apiGet("/summary");
    expect(data).toEqual({ kills: 1 });
  });

  it("throws normalized error on failed envelope", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      async json() {
        return {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "Bad" },
          timestamp: "2026-09-04T00:00:00.000Z",
        };
      },
    }));

    await expect(apiGet("/summary")).rejects.toMatchObject({
      message: "Bad",
      code: "VALIDATION_ERROR",
    });
  });

  it("throws on non-ok HTTP status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      async json() {
        return { success: false, error: { message: "Server error" } };
      },
    }));

    await expect(apiGet("/summary")).rejects.toMatchObject({
      message: "Server error",
    });
  });
});