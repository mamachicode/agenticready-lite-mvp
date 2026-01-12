import { prisma } from "./prisma.ts";

export async function getOrderById(id: string) {
  return prisma.order.findUnique({ where: { id } });
}
