export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pass } = await req.json();

  return NextResponse.json({
    youSent: pass,
    serverSees: process.env.ADMIN_PASS,
    adminEnvKeys: Object.keys(process.env).filter(k => k.toUpperCase().includes("ADMIN")),
  });
}
