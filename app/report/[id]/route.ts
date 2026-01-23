import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSignedReportUrl } from "@/lib/email";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order || !order.reportS3Key) {
    return new NextResponse("Report not found", { status: 404 });
  }

  const signedUrl = await getSignedReportUrl(order.reportS3Key);

  return NextResponse.redirect(signedUrl);
}
