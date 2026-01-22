import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;

  await prisma.order.update({
    where: { id },
    data: { status: "SENT", fulfilledAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
