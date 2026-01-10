import { prisma } from "@/lib/prisma";
import { sendReportReadyEmail } from "@/lib/email";

export async function POST(req: Request) {
  const form = await req.formData();
  const orderId = form.get("orderId") as string;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "FULFILLED" },
  });

  await sendReportReadyEmail(order.email);

  return Response.redirect("/admin/orders", 302);
}
