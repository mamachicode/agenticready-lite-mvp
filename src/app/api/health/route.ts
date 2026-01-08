import { NextResponse } from 'next/server';

export async function GET() {
  console.log(`APP_ENV=${process.env.APP_ENV}`);
  return NextResponse.json({ ok: true });
}
