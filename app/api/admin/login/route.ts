import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pass } = await req.json();

  return NextResponse.json({
    youSent: pass,
    serverSees: process.env.ADMIN_PASS,
    adminKeys: Object.keys(process.env).filter(k => k.includes("ADMIN")),
  });
}
