import type { VercelRequest, VercelResponse } from '@vercel/node'
import { BISect_OK } from './lib/bisect'

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ ok: true, bisect: BISect_OK })
}
