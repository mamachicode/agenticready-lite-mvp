import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Admin auth guard (manual-first, deterministic)
 * Next.js 16 compliant
 */
export async function requireAdmin(_req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}
