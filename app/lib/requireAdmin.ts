import { NextRequest, NextResponse } from "next/server";

export function requireAdmin(req: NextRequest): void {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== "ok") {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
