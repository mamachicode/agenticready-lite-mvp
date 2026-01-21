import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/adminToken";

export function requireAdmin(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}
