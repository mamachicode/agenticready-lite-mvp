import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { sendReportEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  requireAdmin(req);

  const { orderId } = await req.json();

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "FULFILLED" },
  });

  await sendReportEmail(orderId);

  return NextResponse.json({ ok: true });
}
