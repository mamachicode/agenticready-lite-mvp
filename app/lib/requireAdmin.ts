import { NextRequest, NextResponse } from "next/server";

export function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  // admin_token is set by /api/admin/login
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}
