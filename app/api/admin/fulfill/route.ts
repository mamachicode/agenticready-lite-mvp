import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { sendReportEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const { orderId } = await req.json();

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "FULFILLED" },
  });

  await sendReportEmail(order.email, order.id);
  return NextResponse.json({ ok: true });
}
