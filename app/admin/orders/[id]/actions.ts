"use server";

import { prisma } from "@/lib/prisma";
import { uploadPdfAndPresign } from "@/lib/s3";
import { sendReportReadyEmail } from "@/lib/email";

export async function fetchAdminOrder(id: string) {
  return prisma.order.findUnique({ where: { id } });
}

export async function uploadReport(formData: FormData) {
  const file = formData.get("file") as File;
  const orderId = formData.get("orderId") as string;

  const s3Key = await uploadPdfAndPresign({ key: `orders/${orderId}/report.pdf` });

  await prisma.order.update({
    where: { id: orderId },
    data: { reportS3Key: s3Key }
  });
}

export async function fulfillOrder(formData: FormData) {
  const orderId = formData.get("orderId") as string;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "fulfilled", fulfilledAt: new Date() }
  });

  await sendReportReadyEmail({ to: order.email, orderId, downloadUrl: `https://agenticready-lite-mvp-three.vercel.app/api/orders/${orderId}/download` });
}
