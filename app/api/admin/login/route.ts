import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pass } = await req.json();

  if (pass !== process.env.ADMIN_PASS) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("admin_token", "ok", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return res;
}
