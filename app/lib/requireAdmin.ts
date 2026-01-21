import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function requireAdmin() {
  const token = cookies().get("admin_token");

  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}
