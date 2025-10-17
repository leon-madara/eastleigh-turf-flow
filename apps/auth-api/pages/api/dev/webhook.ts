import type { NextApiRequest, NextApiResponse } from 'next'
import { handleCors } from '../../../utils/cors'
import { logInfo } from '../../../utils/logger'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const corsPreflight = handleCors(req, res)
  if (corsPreflight) return

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const body = req.body
    logInfo('dev_webhook_received', { body })
    return res.status(200).json({ ok: true })
  } catch (e) {
    return res.status(400).json({ error: 'Bad Request' })
  }
}

