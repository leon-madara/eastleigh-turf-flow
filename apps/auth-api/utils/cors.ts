import type { NextApiRequest, NextApiResponse } from 'next'

const parseAllowedOrigins = (): string[] => {
  const raw = process.env.ALLOWED_ORIGINS || ''
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function handleCors(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigins = parseAllowedOrigins()
  const origin = req.headers.origin as string | undefined
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  }

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return true
  }

  return false
}

