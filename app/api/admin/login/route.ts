export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pass } = await req.json();

  return NextResponse.json({
    ok: true,
    hasAdminPass: Boolean(process.env.ADMIN_PASS),
    commit: process.env.VERCEL_GIT_COMMIT_SHA || "no-commit",
    env: process.env.VERCEL_ENV || "no-env",
    adminKeys: Object.keys(process.env).filter(k => k.toUpperCase().includes("ADMIN")),
  });
}
