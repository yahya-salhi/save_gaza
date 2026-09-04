import { z } from "zod";

/**
 * Server configuration — validated from environment variables via Zod.
 *
 * Validation is lazy: `env()` only parses the environment the first time a
 * config field is accessed, so modules imported in tests that never touch a
 * required field (e.g. health routes only read `corsOrigin`) don't force a
 * full env parse. `DATABASE_URL` is optional in the schema but enforced by the
 * `databaseUrl` getter so the app fails fast only where the connection string
 * is actually needed.
 */
const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional().default(""),
  JWT_SECRET: z.string().min(1).default("dev-secret-change-me"),
  JWT_EXPIRY: z.string().min(1).default("15m"),
  JWT_REFRESH_EXPIRY: z.string().min(1).default("7d"),
});

export type Env = z.infer<typeof EnvSchema>;

let cached: Env | undefined;

function env(): Env {
  if (!cached) {
    cached = EnvSchema.parse(process.env);
  }
  return cached;
}

export const config = {
  get nodeEnv(): Env["NODE_ENV"] {
    return env().NODE_ENV;
  },
  get port(): number {
    return env().PORT;
  },
  get corsOrigin(): string {
    return env().CORS_ORIGIN;
  },
  get databaseUrl(): string {
    const url = env().DATABASE_URL;
    if (!url) {
      throw new Error("Missing required environment variable: DATABASE_URL");
    }
    return url;
  },
  get redisUrl(): string {
    return env().REDIS_URL;
  },
  get jwtSecret(): string {
    return env().JWT_SECRET;
  },
  get jwtExpiry(): string {
    return env().JWT_EXPIRY;
  },
  get jwtRefreshExpiry(): string {
    return env().JWT_REFRESH_EXPIRY;
  },
};
