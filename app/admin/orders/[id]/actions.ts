"use server";

export const runtime = "nodejs";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadReport(orderId: string, s3Key: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { reportS3Key: s3Key }
  });

  revalidatePath(`/admin/orders/${orderId}`);
}

export async function fulfillOrder(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "fulfilled", fulfilledAt: new Date() }
  });

  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}`);
}
