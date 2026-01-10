import { prisma } from "@/lib/prisma";
import { uploadPdfAndPresign } from "@/lib/s3";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const orderId = form.get("orderId") as string;

  const key = await uploadPdfAndPresign(file, orderId);
  await prisma.order.update({ where: { id: orderId }, data: { reportS3Key: key } });

  return Response.redirect(`/admin/orders/${orderId}`, 302);
}
