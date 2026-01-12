"use server";

import { prisma } from "@/lib/prisma";

export async function fetchAdminOrder(id: string) {
  try {
    return await prisma.order.findUnique({ where: { id } });
  } catch (err) {
    console.error("[ADMIN_ORDER_DETAIL_CRASH]", { id, err });
    throw err;
  }
}
