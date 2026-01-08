import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendReportEmail(
  to: string,
  downloadUrl: string
) {
  await transporter.sendMail({
    from: "AgenticReady <no-reply@agenticready.com>",
    to,
    subject: "Your Audit Report",
    text: `Your audit report is ready.\n\nDownload (valid for 7 days):\n${downloadUrl}`,
  });
}
