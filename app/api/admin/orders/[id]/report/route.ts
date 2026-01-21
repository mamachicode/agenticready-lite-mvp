import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin();
  if (auth) return auth;

  const order = await prisma.order.findUnique({
    where: { id: params.id },
  });

  return NextResponse.json(order);
}
