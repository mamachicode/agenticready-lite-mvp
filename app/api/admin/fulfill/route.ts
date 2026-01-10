import { prisma } from "@/lib/prisma";
import { sendReportEmail } from "@/lib/email";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME!;
const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
  const form = await req.formData();
  const orderId = form.get("orderId") as string;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "FULFILLED" },
  });

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: order.reportS3Key!,
    }),
    { expiresIn: SIGNED_URL_EXPIRY }
  );

  await sendReportEmail(order.email, signedUrl);

  return Response.redirect("/admin/orders", 302);
}
