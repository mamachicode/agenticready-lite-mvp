import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { uploadPdfAndPresign } from "@/lib/s3";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const { orderId, key } = await req.json();

  await prisma.order.update({
    where: { id: orderId },
    data: { reportKey: key, status: "FULFILLED" },
  });

  return NextResponse.json({ ok: true });
}
