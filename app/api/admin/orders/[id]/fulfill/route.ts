import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import { uploadPdfAndPresign } from "@/lib/s3";
import { sendReportEmail } from "@/lib/email";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { id } = await context.params;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Missing PDF file" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // ---- 1) Upload PDF to S3 ----
  const buffer = Buffer.from(await file.arrayBuffer());
  const s3Key = `reports/${id}.pdf`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: s3Key,
      Body: buffer,
      ContentType: "application/pdf",
    })
  );

  // ---- 2) Generate secure download link ----
  const downloadUrl = await uploadPdfAndPresign({ key: s3Key });

  // ---- 3) Send email ----
  await sendReportEmail({
    to: order.email,
    downloadUrl,
  });

  // ---- 4) Mark order SENT ----
  await prisma.order.update({
    where: { id },
    data: {
      status: "SENT",
      reportS3Key: s3Key,
      fulfilledAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
