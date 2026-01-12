import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST() {
  const token = cookies().get("admin_token")?.value;
  if (token !== "ok") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.create({
    data: {
      email: "test@example.com",
      status: "paid",
      stripeSessionId: "seed",
      amount: 1000,
      currency: "usd",
      reportS3Key: null,
    },
  });

  return NextResponse.json({ ok: true, id: order.id });
}
