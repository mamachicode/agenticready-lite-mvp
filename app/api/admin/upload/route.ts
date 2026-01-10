import { prisma } from "@/lib/prisma";
import { uploadPdfAndPresign } from "@/lib/s3";

export async function POST(req: Request) {
  const form = await req.formData();
  const orderId = form.get("orderId") as string;
  const file = form.get("file") as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { s3Key } = await uploadPdfAndPresign(buffer, file.name);

  await prisma.order.update({
    where: { id: orderId },
    data: { reportS3Key: s3Key },
  });

  return Response.redirect(`/admin/orders/${orderId}`, 302);
}
