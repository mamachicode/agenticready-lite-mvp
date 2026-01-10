import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always pass through, but stamp headers so we can see what Vercel thinks the path is.
  const res = NextResponse.next();
  res.headers.set("x-ar-pathname", pathname);
  res.headers.set("x-ar-has-token", req.cookies.get("admin_token")?.value ? "1" : "0");

  // Only guard /admin routes
  if (!pathname.startsWith("/admin")) return res;

  // Allow login page ALWAYS (support both /admin/login and /admin/login/)
  if (pathname === "/admin/login" || pathname === "/admin/login/") return res;

  // Require admin token for everything else under /admin
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    const redir = NextResponse.redirect(url);
    redir.headers.set("x-ar-pathname", pathname);
    redir.headers.set("x-ar-has-token", "0");
    return redir;
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
