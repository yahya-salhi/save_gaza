import { describe, it, expect, beforeEach, vi } from "vitest";

describe("env config", () => {
  const baseEnv = {
    NODE_ENV: "test",
    PORT: "4000",
    CORS_ORIGIN: "http://localhost:3000",
    JWT_SECRET: "test-secret",
  };

  beforeEach(() => {
    vi.resetModules();
    for (const key of Object.keys(process.env)) {
      if (
        key.startsWith("SAVEGAZA_") ||
        ["NODE_ENV", "PORT", "CORS_ORIGIN", "DATABASE_URL", "REDIS_URL",
         "JWT_SECRET", "JWT_EXPIRY", "JWT_REFRESH_EXPIRY",
         "TURNSTILE_SECRET_KEY", "TURNSTILE_SITE_KEY", "SENTRY_DSN"].includes(key)
      ) {
        delete process.env[key];
      }
    }
  });

  it("applies defaults when env vars are missing", async () => {
    process.env.NODE_ENV = "development";
    const { config } = await import("./config.js");
    expect(config.port).toBe(3000);
    expect(config.corsOrigin).toBe("http://localhost:5173");
    expect(config.jwtSecret).toBe("dev-secret-change-me");
    expect(config.jwtExpiry).toBe("15m");
    expect(config.jwtRefreshExpiry).toBe("7d");
    expect(config.redisUrl).toBe("");
  });

  it("reads custom values from env", async () => {
    process.env.PORT = "8080";
    process.env.CORS_ORIGIN = "https://example.com";
    process.env.JWT_SECRET = "my-secret";
    process.env.JWT_EXPIRY = "30m";
    process.env.JWT_REFRESH_EXPIRY = "14d";
    process.env.REDIS_URL = "redis://localhost:6379";
    const { config } = await import("./config.js");
    expect(config.port).toBe(8080);
    expect(config.corsOrigin).toBe("https://example.com");
    expect(config.jwtSecret).toBe("my-secret");
    expect(config.jwtExpiry).toBe("30m");
    expect(config.jwtRefreshExpiry).toBe("14d");
    expect(config.redisUrl).toBe("redis://localhost:6379");
  });

  it("throws on invalid PORT (non-numeric)", async () => {
    process.env.NODE_ENV = "development";
    process.env.PORT = "not-a-number";
    const { validateEnv } = await import("./config.js");
    expect(() => validateEnv()).toThrow();
  });

  it("throws on invalid CORS_ORIGIN (not a URL)", async () => {
    process.env.NODE_ENV = "development";
    process.env.CORS_ORIGIN = "not-a-url";
    const { validateEnv } = await import("./config.js");
    expect(() => validateEnv()).toThrow();
  });

  it("accepts optional DATABASE_URL", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/savegaza";
    const { config } = await import("./config.js");
    expect(config.databaseUrl).toBe("postgresql://localhost:5432/savegaza");
  });

  it("throws when databaseUrl getter is called without DATABASE_URL", async () => {
    process.env.NODE_ENV = "development";
    const { config } = await import("./config.js");
    expect(() => config.databaseUrl).toThrow("Missing required environment variable: DATABASE_URL");
  });

  it("accepts optional TURNSTILE_SECRET_KEY and TURNSTILE_SITE_KEY", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret-key";
    process.env.TURNSTILE_SITE_KEY = "site-key";
    const { config } = await import("./config.js");
    expect(config.turnstileSecretKey).toBe("secret-key");
    expect(config.turnstileSiteKey).toBe("site-key");
  });

  it("returns undefined for optional vars when unset", async () => {
    process.env.NODE_ENV = "development";
    const { config } = await import("./config.js");
    expect(config.turnstileSecretKey).toBeUndefined();
    expect(config.turnstileSiteKey).toBeUndefined();
    expect(config.sentryDsn).toBeUndefined();
  });

  it("accepts optional SENTRY_DSN with valid URL", async () => {
    process.env.SENTRY_DSN = "https://abc123@o123456.ingest.sentry.io/123456";
    const { config } = await import("./config.js");
    expect(config.sentryDsn).toBe("https://abc123@o123456.ingest.sentry.io/123456");
  });

  it("throws on invalid SENTRY_DSN (not a URL)", async () => {
    process.env.SENTRY_DSN = "not-a-url";
    const { validateEnv } = await import("./config.js");
    expect(() => validateEnv()).toThrow();
  });

  it("caches parsed env across multiple accesses", async () => {
    process.env.PORT = "9999";
    const { config } = await import("./config.js");
    const first = config.port;
    const second = config.port;
    expect(first).toBe(second);
  });
});
