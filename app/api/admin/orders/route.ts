import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const orders = await prisma.order.findMany({
    where: { status: "PAID" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
