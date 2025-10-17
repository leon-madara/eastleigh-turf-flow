import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

export function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true as const,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    // Cookie expiration is controlled by Firebase session cookie internally.
  }
}

export function setSessionCookie(
  res: NextApiResponse,
  name: string,
  value: string,
  options = getCookieOptions()
) {
  res.setHeader('Set-Cookie', serialize(name, value, options))
}

export function clearSessionCookie(res: NextApiResponse, name: string) {
  res.setHeader(
    'Set-Cookie',
    serialize(name, '', {
      ...getCookieOptions(),
      maxAge: 0,
      expires: new Date(0),
    })
  )
}

export function getSessionCookie(req: NextApiRequest, name: string) {
  const cookies = req.cookies || {}
  return cookies[name]
}

