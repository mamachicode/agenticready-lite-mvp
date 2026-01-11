import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../../../../src/lib/requireAdmin";
import { prisma } from "../../../../src/lib/prisma";
import { sendReportEmail } from "../../../../src/lib/email";

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const { orderId } = await req.json();
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order || order.status !== "PAID") {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }

  await prisma.order.update({ where: { id: orderId }, data: { status: "FULFILLED" }});
  await sendReportEmail(order.email, order.id);
  return NextResponse.json({ ok: true });
}
