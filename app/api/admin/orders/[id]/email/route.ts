import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReportEmail } from "@/lib/email";

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

    await sendReportEmail(order);

    await prisma.order.update({
      where: { id },
      data: {
        status: "SENT",
        fulfilledAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error("EMAIL_ROUTE_ERROR", error);

    return NextResponse.json(
      {
        error: error?.message || "Email send failed",
        name: error?.name,
        code: error?.code,
        stack: error?.stack,
      },
      { status: 500 }
    );
  }
}
