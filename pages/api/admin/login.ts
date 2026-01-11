import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { pass } = req.body;
  if (pass !== process.env.ADMIN_PASS) return res.status(401).end();

  res.setHeader("Set-Cookie", cookie.serialize("admin_token", "ok", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
  }));

  res.status(200).json({ ok: true });
}
