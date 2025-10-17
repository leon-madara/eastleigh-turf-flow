import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminAuth } from '../../../lib/firebaseAdmin'
import { clearSessionCookie, getSessionCookie } from '../../../utils/cookies'
import { handleCors } from '../../../utils/cors'
import { logInfo, logError, reqMeta, errorMeta } from '../../../utils/logger'
import crypto from 'node:crypto'

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'sid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const corsPreflight = handleCors(req, res)
  if (corsPreflight) return

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const rid = req.headers['x-request-id'] || crypto.randomUUID()
    logInfo('logout_request', { rid, ...reqMeta(req) })

    const cookie = getSessionCookie(req, COOKIE_NAME)
    if (cookie) {
      try {
        const auth = getAdminAuth()
        const decoded = await auth.verifySessionCookie(cookie, false).catch(() => null)
        if (decoded?.uid) {
          // Revoke refresh tokens to invalidate existing sessions
          await auth.revokeRefreshTokens(decoded.uid)
          logInfo('logout_revoke_tokens', { rid, uid: decoded.uid })
        }
      } catch {
        // Ignore revocation errors
      }
    }

    clearSessionCookie(res, COOKIE_NAME)
    logInfo('logout_success', { rid })
    return res.status(200).json({ ok: true })
  } catch (err) {
    const rid = req.headers['x-request-id'] || 'unknown'
    logError('logout_error', { rid, ...errorMeta(err) })
    return res.status(200).json({ ok: true })
  }
}
