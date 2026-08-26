import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma as PrismaNamespace } from "../generated/prisma/index.js";
import { PrismaClient } from "../generated/prisma/index.js";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });
export { PrismaNamespace as Prisma };
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
