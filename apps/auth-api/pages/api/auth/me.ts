import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminAuth } from '../../../lib/firebaseAdmin'
import { getSessionCookie } from '../../../utils/cookies'
import { handleCors } from '../../../utils/cors'
import { logInfo, logError, reqMeta, errorMeta } from '../../../utils/logger'
import crypto from 'node:crypto'
import { prisma } from '../../../lib/prisma'

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'sid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const corsPreflight = handleCors(req, res)
  if (corsPreflight) return

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const rid = req.headers['x-request-id'] || crypto.randomUUID()
    logInfo('me_request', { rid, ...reqMeta(req) })

    const cookie = getSessionCookie(req, COOKIE_NAME)
    if (!cookie) return res.status(401).json({ error: 'Unauthorized' })

    const auth = getAdminAuth()
    const decoded = await auth.verifySessionCookie(cookie, true)
    const uid = decoded.uid

    const user = await prisma.user.findUnique({ where: { uid } })
    if (!user) {
      logError('me_no_user_record', { rid, uid })
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (user.status !== 'ACTIVE') {
      logInfo('me_forbidden_status', { rid, uid, status: user.status })
      return res.status(403).json({ error: 'Not approved' })
    }

    logInfo('me_success', { rid, uid, status: user.status })
    return res.status(200).json({
      user: {
        uid,
        phone: user.phoneE164,
        role: user.role,
        status: user.status,
      },
    })
  } catch (err) {
    const rid = req.headers['x-request-id'] || 'unknown'
    logError('me_error', { rid, ...errorMeta(err) })
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
