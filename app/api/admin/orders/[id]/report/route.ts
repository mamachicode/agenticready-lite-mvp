import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  return NextResponse.json(order);
}
