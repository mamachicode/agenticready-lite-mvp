import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(req: Request) {
  const admin = requireAdmin(req as any);
  if (admin) return admin;

  const order = await prisma.order.create({
    data: {
      email: "test@example.com",
      status: "paid",
      stripeSessionId: "seed",
      amount: 1000,
      currency: "usd",
      reportS3Key: null,
    },
  });

  return NextResponse.json({ ok: true, id: order.id });
}
