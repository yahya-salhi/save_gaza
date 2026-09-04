import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { requestLogger } from "./requestLogger.js";
import { logger } from "../infrastructure/logger.js";

vi.mock("../infrastructure/logger", () => ({
  logger: { log: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

function createReqRes(path: string) {
  const req = { path, method: "GET" } as Request;
  const res = {
    statusCode: 200,
    on: vi.fn((event: string, cb: () => void) => {
      if (event === "finish") cb();
    }),
  } as unknown as Response;
  const next = vi.fn() as NextFunction;
  return { req, res, next };
}

describe("requestLogger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls next()", () => {
    const { req, res, next } = createReqRes("/api/test");
    requestLogger(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("logs request on finish", () => {
    const { req, res, next } = createReqRes("/api/test");
    requestLogger(req, res, next);
    expect(logger.log).toHaveBeenCalledWith("info", expect.stringContaining("GET /api/test 200"));
  });

  it("skips logging for /health", () => {
    const { req, res, next } = createReqRes("/health");
    requestLogger(req, res, next);
    expect(logger.log).not.toHaveBeenCalled();
  });

  it("skips logging for /ready", () => {
    const { req, res, next } = createReqRes("/ready");
    requestLogger(req, res, next);
    expect(logger.log).not.toHaveBeenCalled();
  });

  it("logs 4xx as warn", () => {
    const req = { path: "/api/test", method: "GET" } as Request;
    const res = {
      statusCode: 404,
      on: vi.fn((event: string, cb: () => void) => {
        if (event === "finish") cb();
      }),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    requestLogger(req, res, next);
    expect(logger.log).toHaveBeenCalledWith("warn", expect.stringContaining("404"));
  });

  it("logs 5xx as error", () => {
    const req = { path: "/api/test", method: "POST" } as Request;
    const res = {
      statusCode: 500,
      on: vi.fn((event: string, cb: () => void) => {
        if (event === "finish") cb();
      }),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    requestLogger(req, res, next);
    expect(logger.log).toHaveBeenCalledWith("error", expect.stringContaining("500"));
  });
});
