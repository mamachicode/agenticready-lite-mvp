export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { uploadPdfAndPresign } from "@/lib/s3";
import { sendReportEmail } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;

  console.log("ORDER_SEND_START", { orderId: id });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "No PDF uploaded" },
      { status: 400 }
    );
  }

  const downloadUrl = await uploadPdfAndPresign({ key: id });
  console.log("S3_UPLOAD_OK", { orderId: id, downloadUrl });

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  const sesResult = await sendReportEmail({
    to: order.email,
    downloadUrl: downloadUrl,
  });

  console.log("SES_SEND_OK", {
    orderId: id,
    messageId: "sent",
  });

  await prisma.order.update({
    where: { id },
    data: {
      status: "SENT",
      fulfilledAt: new Date(),
    },
  });

  console.log("ORDER_STATUS_UPDATED_TO_SENT", { orderId: id });

  return NextResponse.json({ ok: true });
}
