import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ses = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const s3 = new S3Client({
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
  websiteUrl?: string | null;
  firstName?: string;
}) {
  const subject = "Your Agentic Readiness Report Is Ready";
  const name = params.firstName || "there";

  const absoluteUrl = params.downloadUrl.startsWith("http")
    ? params.downloadUrl
    : `${process.env.APP_URL}${params.downloadUrl}`;

  const text = `
Hi ${name},

Your Agentic Readiness Lite Report is ready.

Website Audited:
${params.websiteUrl || "Not provided"}

Download here:
${absoluteUrl}

This report provides an independent, agent-focused evaluation of how your site is currently interpreted by autonomous systems, along with prioritized observations.

If you have any questions after reviewing the report, reply directly to this email.

— AgenticReady
https://agenticready.ai
`;

  const html = `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Your Agentic Readiness Report Is Ready</title>
</head>
<body style="margin:0;padding:0;background:#f6f7f9;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
Your Agentic Readiness Lite report is ready. Download securely using the button inside.
</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f6f7f9;">
<tr>
<td align="center" style="padding:28px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="width:640px;max-width:100%;">
<tr>
<td style="background:#ffffff;border:1px solid #e6e8eb;border-radius:14px;padding:28px 22px;">

<h2 style="text-align:center;">Your Agentic Readiness Report Is Ready</h2>

<p>Hi ${name},</p>

<p>Your <strong>Agentic Readiness Lite</strong> report is ready.</p>

<p><strong>Website Audited:</strong><br/>
${params.websiteUrl || "Not provided"}</p>

<p>You can securely access your report using the button below:</p>

<p style="text-align:center;">
<a href="${absoluteUrl}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
Download Report
</a>
</p>

<p>If the button does not work, copy and paste this link into your browser:</p>

<p style="word-break:break-all;">
<a href="https://agenticready.ai/report/${params.orderId}" style="color:#2563eb;text-decoration:underline;">
https://agenticready.ai/report/${params.orderId}
</a>
</p>

<p>
This report provides an independent, agent-focused evaluation of how your site is currently interpreted by autonomous systems, along with prioritized observations.
</p>

<p>
If you have any questions after reviewing the report, reply to this email or contact us at
<a href="mailto:reports@agenticready.ai">reports@agenticready.ai</a>.
</p>

<p>
Thank you for trusting AgenticReady.<br/><br/>
—<br/>
<strong>AgenticReady</strong><br/>
<a href="https://agenticready.ai">https://agenticready.ai</a>
</p>

<hr style="border:none;border-top:1px solid #e6e8eb;margin:18px 0;" />

<p style="font-size:12px;color:#6b7280;">
This link is private and intended only for the original recipient.
</p>

</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>
`;

  const cmd = new SendEmailCommand({
    Destination: {
      ToAddresses: [params.to],
      BccAddresses: ["reports@agenticready.ai"],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: text },
        Html: { Data: html },
      },
    },
    Source: `"AgenticReady" <reports@agenticready.ai>`,
  });

  await ses.send(cmd);
}

export async function getSignedReportUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });
}

export async function sendReportEmail(a: any) {
  return sendReportReadyEmail(a);
}
