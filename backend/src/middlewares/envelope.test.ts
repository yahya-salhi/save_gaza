import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { successResponse, errorResponse } from "./envelope.js";

const app = createApp();

describe("successResponse", () => {
  it("returns the standard success envelope", () => {
    const result = successResponse({ count: 5 });
    expect(result).toMatchObject({
      success: true,
      data: { count: 5 },
      error: null,
    });
    expect(typeof result.timestamp).toBe("string");
  });

  it("supports null/undefined data", () => {
    const result = successResponse(null);
    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
  });
});

describe("errorResponse", () => {
  it("returns the standard error envelope", () => {
    const result = errorResponse("VALIDATION_ERROR", "Bad input");
    expect(result).toMatchObject({
      success: false,
      data: null,
      error: { code: "VALIDATION_ERROR", message: "Bad input" },
    });
    expect(typeof result.timestamp).toBe("string");
  });
});

describe("envelope shape via API", () => {
  it("GET /health returns the full envelope with timestamp", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("error", null);
    expect(res.body).toHaveProperty("timestamp");
    expect(typeof res.body.timestamp).toBe("string");
    expect(res.headers["content-type"]).toContain("application/json");
  });

  it("GET /api/v1/nonexistent returns error envelope", async () => {
    const res = await request(app).get("/api/v1/nonexistent");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBeNull();
    expect(res.body.error).toMatchObject({
      code: "NOT_FOUND",
      message: "Endpoint not found",
    });
    expect(typeof res.body.timestamp).toBe("string");
  });
});
