"use server";

import { prisma } from "@/lib/prisma";

export async function fetchPaidOrders() {
  return prisma.order.findMany({
    where: { status: "paid" },
    orderBy: { createdAt: "desc" },
  });
}
