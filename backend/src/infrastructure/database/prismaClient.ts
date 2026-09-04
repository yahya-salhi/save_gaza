import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "../../config.js";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/**
 * Singleton PrismaClient — avoids multiple instances in development (hot reload).
 * Uses PrismaPg driver adapter for Prisma 7 and the validated `config.databaseUrl`.
 */
function createPrismaClient(): PrismaClient {
  const connectionString = config.databaseUrl;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}