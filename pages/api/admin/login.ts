import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { pass } = req.body;
  if (pass !== process.env.ADMIN_PASS) return res.status(401).end();

  // Vercel-safe admin session cookie
  res.setHeader("Set-Cookie", [
    `admin_token=ok; Path=/; HttpOnly; Secure; SameSite=None`
  ]);

  res.status(200).json({ ok: true });
}
