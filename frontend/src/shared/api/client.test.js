import { describe, it, expect, vi, afterEach } from "vitest";
import { apiGet, apiPost, apiPatch, ApiError } from "./client";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/**
 * Builds a stubbed fetch mock returning a Response-like object.
 * @param {object} opts
 */
function stubFetch({ ok = true, status = 200, body = {}, jsonRejects = false } = {}) {
  const mock = vi.fn().mockResolvedValue({
    ok,
    status,
    async json() {
      if (jsonRejects) throw new SyntaxError("Unexpected token");
      return body;
    },
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

const successEnvelope = (data) => ({
  success: true,
  data,
  error: null,
  timestamp: "2026-09-09T00:00:00.000Z",
});

describe("apiGet envelope unwrapping", () => {
  it("returns data on success envelope", async () => {
    stubFetch({ body: successEnvelope({ kills: 1 }) });
    const data = await apiGet("/summary");
    expect(data).toEqual({ kills: 1 });
  });

  it("throws normalized error on failed envelope", async () => {
    stubFetch({
      body: {
        success: false,
        data: null,
        error: { code: "VALIDATION_ERROR", message: "Bad" },
        timestamp: "2026-09-09T00:00:00.000Z",
      },
    });

    await expect(apiGet("/summary")).rejects.toMatchObject({
      message: "Bad",
      code: "VALIDATION_ERROR",
    });
  });

  it("throws ApiError instance on failed envelope", async () => {
    stubFetch({
      body: {
        success: false,
        error: { code: "EXTERNAL_API_ERROR", message: "Upstream down" },
      },
    });

    await expect(apiGet("/summary")).rejects.toBeInstanceOf(ApiError);
  });

  it("throws on non-ok HTTP status", async () => {
    stubFetch({
      ok: false,
      status: 500,
      body: { success: false, error: { code: "INTERNAL_ERROR", message: "Server error" } },
    });

    await expect(apiGet("/summary")).rejects.toMatchObject({
      message: "Server error",
      code: "INTERNAL_ERROR",
    });
  });

  it("falls back to status text when error body is not JSON", async () => {
    stubFetch({
      ok: false,
      status: 503,
      jsonRejects: true,
    });

    await expect(apiGet("/summary")).rejects.toMatchObject({
      message: "Request failed with status 503",
      code: "HTTP_ERROR",
    });
  });

  it("throws generic error when envelope lacks a message", async () => {
    stubFetch({ body: { success: false, error: null } });

    await expect(apiGet("/summary")).rejects.toMatchObject({
      message: "Unknown error",
      code: "API_ERROR",
    });
  });

  it("requests with Accept application/json header", async () => {
    const mock = stubFetch({ body: successEnvelope({}) });
    await apiGet("/summary");
    expect(mock).toHaveBeenCalledWith(
      expect.stringContaining("/summary"),
      expect.objectContaining({ headers: { Accept: "application/json" } }),
    );
  });
});

describe("apiPost", () => {
  it("POSTs JSON body to the endpoint and unwraps data", async () => {
    const mock = stubFetch({ body: successEnvelope({ id: "123" }) });
    const data = await apiPost("/incidents", { title: "Test" });

    expect(data).toEqual({ id: "123" });
    const [url, init] = mock.mock.calls[0];
    expect(url).toContain("/incidents");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({ title: "Test" });
  });

  it("throws normalized error on failed POST envelope", async () => {
    stubFetch({
      body: {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Coordinates required" },
      },
    });

    await expect(apiPost("/incidents", {})).rejects.toMatchObject({
      message: "Coordinates required",
      code: "VALIDATION_ERROR",
    });
  });
});

describe("apiPatch", () => {
  it("PATCHes JSON body to the endpoint and unwraps data", async () => {
    const mock = stubFetch({ body: successEnvelope({ status: "APPROVED" }) });
    const data = await apiPatch("/admin/incidents/1/status", { status: "APPROVED" });

    expect(data).toEqual({ status: "APPROVED" });
    const [url, init] = mock.mock.calls[0];
    expect(url).toContain("/admin/incidents/1/status");
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body)).toEqual({ status: "APPROVED" });
  });

  it("omits body when not provided", async () => {
    const mock = stubFetch({ body: successEnvelope({}) });
    await apiPatch("/admin/incidents/1/status");
    const [, init] = mock.mock.calls[0];
    expect(init.body).toBeUndefined();
  });
});
