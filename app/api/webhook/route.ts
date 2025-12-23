import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Stripe webhook received (root app)");
  return NextResponse.json({ ok: true });
}
