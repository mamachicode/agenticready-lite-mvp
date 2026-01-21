import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin();
  if (auth) return auth;

  await prisma.order.update({
    where: { id: params.id },
    data: { status: "SENT", fulfilledAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
