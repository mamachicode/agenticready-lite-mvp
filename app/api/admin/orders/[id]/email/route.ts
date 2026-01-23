import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReportEmail, getSignedReportUrl } from "@/lib/email";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PAID") {
      return NextResponse.json(
        { error: "Order is not in PAID status" },
        { status: 400 }
      );
    }

    if (!order.reportS3Key) {
      return NextResponse.json(
        { error: "Report file not uploaded yet" },
        { status: 400 }
      );
    }

    const downloadUrl = await getSignedReportUrl(order.reportS3Key);

    await sendReportEmail({
      to: order.email,
      orderId: order.id,
      downloadUrl,
    });

    await prisma.order.update({
      where: { id },
      data: {
        status: "SENT",
        fulfilledAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error("EMAIL_ROUTE_ERROR_FULL", JSON.stringify(error, null, 2));

    return NextResponse.json(
      {
        error: error?.message,
        name: error?.name,
        code: error?.Code || error?.code,
        metadata: error?.$metadata,
      },
      { status: 500 }
    );
  }
}
