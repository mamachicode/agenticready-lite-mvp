import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST() {
  const auth = requireAdmin();
  if (auth) return auth;

  return NextResponse.json({ ok: true });
}
