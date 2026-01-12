import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const order = await prisma.order.create({
    data: {
      email: "demo@agenticready.com",
      status: "PAID"
    }
  });
  return NextResponse.json({ id: order.id });
}
