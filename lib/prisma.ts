import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // This logs database queries in your terminal so you can see what's happening
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;