import { NextRequest, NextResponse } from "next/server";

export function requireAdmin(req: NextRequest): NextResponse | null {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
