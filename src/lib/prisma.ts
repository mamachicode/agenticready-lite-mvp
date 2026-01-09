import * as Prisma from "@prisma/client";

const prisma =
  (global as any).prisma ||
  new (Prisma as any).PrismaClient();

if (process.env.NODE_ENV !== "production") (global as any).prisma = prisma;

export { prisma };
