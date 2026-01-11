export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pass } = await req.json();

  if (pass !== process.env.ADMIN_PASS) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", "ok", { httpOnly: true, path: "/" });
  return res;
}
