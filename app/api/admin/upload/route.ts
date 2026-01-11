import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { uploadPdfAndPresign } from "@/lib/s3";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const { orderId, fileBase64 } = await req.json();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== "PAID") {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }

  const url = await uploadPdfAndPresign(orderId, fileBase64);

  await prisma.order.update({
    where: { id: orderId },
    data: { reportUrl: url, status: "FULFILLED" },
  });

  return NextResponse.json({ ok: true });
}
