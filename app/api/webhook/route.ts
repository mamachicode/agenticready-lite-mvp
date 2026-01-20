import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("WEBHOOK_HIT_V1");

  console.log("method:", request.method);
  console.log("url:", request.url);
  console.log("host:", request.headers.get("host"));

  let body: any = null;

  try {
    body = await request.json();
    console.log("stripe event id:", body?.id);
  } catch (err) {
    console.log("error reading body:", err);
  }

  return NextResponse.json({ ok: true });
}
