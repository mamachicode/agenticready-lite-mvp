import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME!;

// 7 days (in seconds)
const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 7;

export async function uploadPdfAndPresign(
  fileBuffer: Buffer,
  originalFilename: string
) {
  const key = `reports/${Date.now()}-${originalFilename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: "application/pdf",
    })
  );

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
    { expiresIn: SIGNED_URL_EXPIRY }
  );

  return {
    s3Key: key,
    signedUrl,
  };
}
