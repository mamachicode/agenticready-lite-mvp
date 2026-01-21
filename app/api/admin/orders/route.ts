import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const orders = await prisma.order.findMany({
    where: { status: "PAID" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
