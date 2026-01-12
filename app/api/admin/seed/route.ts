import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(req: Request) {
  // must stay node runtime
  const admin = requireAdmin(req as any);
  if (admin) return admin;

  const order = await prisma.order.create({
    data: {
      email: "test@example.com",
      status: "paid",
      amount: 1000,
      reportUrl: null,
    },
  });

  return NextResponse.json({ ok: true, id: order.id });
}
