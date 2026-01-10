import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.cookies.set("x-pathname", req.nextUrl.pathname);
  return res;
}
