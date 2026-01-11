import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../../../../../src/lib/requireAdmin";
import { prisma } from "../../../../../src/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}
