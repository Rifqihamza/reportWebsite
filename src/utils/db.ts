// Prevent hot-reloading from creating new instances in dev
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = `${import.meta.env.POSTGRES_DATABASE_URL}`;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
    adapter: new PrismaPg({ connectionString })
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;