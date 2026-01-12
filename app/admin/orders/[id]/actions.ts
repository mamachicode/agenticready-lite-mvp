"use server";

import { prisma } from "@/lib/prisma";

export async function fetchAdminOrder(id: string) {
  return prisma.order.findUnique({ where: { id } });
}
