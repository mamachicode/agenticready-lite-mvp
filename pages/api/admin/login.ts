import type { NextApiRequest, NextApiResponse } from "next";
import { signAdminToken } from "../../../lib/adminToken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).end();

  const { pass } = req.body || {};
  if (pass !== process.env.ADMIN_PASS) return res.status(401).json({ ok: false });

  const token = signAdminToken(60 * 60 * 24); // 24h
  return res.status(200).json({ ok: true, token });
}
