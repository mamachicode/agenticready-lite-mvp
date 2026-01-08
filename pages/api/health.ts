import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`APP_ENV=${process.env.APP_ENV}`);
  res.status(200).json({ ok: true });
}
