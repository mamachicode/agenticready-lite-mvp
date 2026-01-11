/**
 * Canonical email spine for AgenticReady Lite
 * Supports both new structured calls and legacy positional calls.
 */

// Primary structured version (canonical)
export async function sendReportReadyEmail(params: {
  to: string;
  orderId: string;
  downloadUrl: string;
}) {
  console.log("EMAIL READY:", params);
}

// Legacy compatibility wrapper
export async function sendReportEmail(a: any, b?: any) {
  if (typeof a === "string") {
    // legacy: sendReportEmail(email, orderId)
    return sendReportReadyEmail({ to: a, orderId: b, downloadUrl: "" });
  }
  // canonical: sendReportEmail({ to, orderId, downloadUrl })
  return sendReportReadyEmail(a);
}
