"use server";

import { prisma } from "@/lib/prisma";

export async function fetchAdminOrder(id: string) {
  return prisma.order.findUnique({ where: { id } });
}

export async function uploadReport(orderId: string, formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return;

  const s3Key = `${orderId}.pdf`;

  await prisma.order.update({
    where: { id: orderId },
    data: { reportS3Key: s3Key }
  });
}

export async function fulfillOrder(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "fulfilled",
      fulfilledAt: new Date()
    }
  });
}
