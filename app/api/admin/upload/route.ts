import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { uploadPdfAndPresign } from "@/lib/s3";

export async function POST(req: NextRequest) {
  requireAdmin(req);

  const { orderId, key } = await req.json();

  await prisma.order.update({
    where: { id: orderId },
    data: { reportS3Key: key },
  });

  const url = await uploadPdfAndPresign({ key });

  return NextResponse.json({ url });
}
