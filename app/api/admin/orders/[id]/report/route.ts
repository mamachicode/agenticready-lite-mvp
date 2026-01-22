import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
  });

  return NextResponse.json(order);
}
