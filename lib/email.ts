import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendReportReadyEmail(params: {
  to: string;
  orderId: string;
  downloadUrl: string;
  firstName?: string;
}) {
  const subject = "Your Agentic Readiness Report Is Ready";

  const name = params.firstName || "there";

  const body = `
Hi ${name},

Your Agentic Readiness Lite Report is ready.

You can securely access your report using the link below:

${params.downloadUrl}

This report provides an independent, agent-focused evaluation of how your site is currently interpreted by autonomous systems, along with prioritized observations.

If you have any questions after reviewing the report, you can reply directly to this email.

Thank you for trusting AgenticReady.

—
AgenticReady
https://agenticready.ai

This link is private and intended only for the original recipient.
`;

  const cmd = new SendEmailCommand({
    Destination: {
      ToAddresses: [params.to],
      BccAddresses: ["reports@agenticready.ai"], // Ops audit rule
    },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: body } },
    },
    Source: process.env.EMAIL_FROM!,
  });

  await ses.send(cmd);
}

// Legacy compatibility wrapper
export async function sendReportEmail(a: any, b?: any) {
  if (typeof a === "string") {
    return sendReportReadyEmail({ to: a, orderId: b, downloadUrl: "" });
  }
  return sendReportReadyEmail(a);
}


// -------- S3 Signed URL Helper --------

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedReportUrl(key: string) {
  const bucket = process.env.AWS_S3_BUCKET!;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  // Link valid for 24 hours
  return await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });
}
