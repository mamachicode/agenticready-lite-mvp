export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

"use server";

import { prisma } from "@/lib/prisma";

export async function fetchAdminOrder(id: string) {
  return prisma.order.findUnique({ where: { id } });
}
