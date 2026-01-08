import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadPdfAndPresign } from "@/lib/s3";
import { sendReportEmail } from "@/lib/email";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const formData = await req.formData();
    const file = formData.get("report");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "PDF required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 🔒 HARD GATES
    if (order.status !== "PAID") {
      return NextResponse.json(
        { error: "Order must be PAID before uploading report" },
        { status: 403 }
      );
    }

    if (order.reportUploadedAt) {
      return NextResponse.json(
        { error: "Report already uploaded for this order" },
        { status: 409 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const { s3Key, signedUrl } = await uploadPdfAndPresign(buffer, file.name);

    // Atomic finalize
    await prisma.order.update({
      where: { id },
      data: {
        reportS3Key: s3Key,
        reportUploadedAt: new Date(),
        status: "FULFILLED",
      },
    });

    try {
      await sendReportEmail(order.email, signedUrl);
    } catch (err) {
      console.error("EMAIL SEND FAILED (IGNORED):", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPLOAD REPORT ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
