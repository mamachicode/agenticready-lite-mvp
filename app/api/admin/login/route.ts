export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pass } = await req.json();

  if (pass !== process.env.ADMIN_PASS) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const res = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );

  res.cookies.set({
    name: "admin_token",
    value: "ok",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
  });

  return res;
}
