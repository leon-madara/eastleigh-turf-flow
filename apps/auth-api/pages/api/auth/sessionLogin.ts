import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminAuth } from '../../../lib/firebaseAdmin'
import { setSessionCookie, getCookieOptions } from '../../../utils/cookies'
import { handleCors } from '../../../utils/cors'
import { logInfo, logError, reqMeta, errorMeta } from '../../../utils/logger'
import crypto from 'node:crypto'
import { prisma } from '../../../lib/prisma'
import { isAllowedPhone, isAdminPhone } from '../../../utils/allowlist'
import { notifyNewPendingUser } from '../../../utils/notify'

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'sid'
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS || 7)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS and preflight
  const corsPreflight = handleCors(req, res)
  if (corsPreflight) return

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const rid = req.headers['x-request-id'] || crypto.randomUUID()
    logInfo('session_login_request', { rid, ...reqMeta(req) })

    const { idToken } = req.body || {}
    if (!idToken || typeof idToken !== 'string') {
      logError('session_login_bad_request', { rid })
      return res.status(400).json({ error: 'Missing idToken' })
    }

    const auth = getAdminAuth()
    // Verify ID token to assert it's valid and get basic claims
    const decoded = await auth.verifyIdToken(idToken)
    const uid = decoded.uid
    const phoneRaw = decoded.phone_number as string | undefined
    if (!phoneRaw) {
      logError('session_login_missing_phone', { rid, uid })
      return res.status(400).json({ error: 'Phone number required' })
    }

    const phoneE164 = normalizePhoneE164(phoneRaw)

    // JIT provision user in DB
    let user = await prisma.user.findFirst({ where: { OR: [{ uid }, { phoneE164 }] } })
    if (!user) {
      user = await prisma.user.create({ data: { uid, phoneE164 } })
      logInfo('user_created', { rid, uid, phoneE164, status: user.status })
    } else {
      // keep phone and uid in sync if needed
      if (user.phoneE164 !== phoneE164 || user.uid !== uid) {
        user = await prisma.user.update({ where: { id: user.id }, data: { phoneE164, uid } })
        logInfo('user_synced', { rid, uid, phoneE164 })
      }
    }

    // Apply allowlist rules: auto-activate and/or make admin
    const updates: any = {}
    if (isAllowedPhone(phoneE164) && user.status !== 'ACTIVE') updates.status = 'ACTIVE'
    if (isAdminPhone(phoneE164) && user.role !== 'ADMIN') updates.role = 'ADMIN'
    if (Object.keys(updates).length) {
      user = await prisma.user.update({ where: { id: user.id }, data: updates })
      logInfo('user_allowlist_updated', { rid, uid, phoneE164, ...updates })
    }

    // Notify admin if user remains pending
    if (user.status === 'PENDING') {
      notifyNewPendingUser(phoneE164, uid).catch(() => {})
    }

    // Create a Firebase session cookie
    const expiresIn = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })

    // Optionally, persist user or roles in your DB here using decoded.uid/decoded.phone_number
    // For now, we just set the cookie and return minimal user info

    setSessionCookie(res, COOKIE_NAME, sessionCookie, getCookieOptions())

    logInfo('session_login_success', {
      rid,
      uid,
      hasPhone: Boolean(phoneRaw),
      status: user.status,
    })

    return res.status(200).json({
      user: {
        uid,
        phone: phoneE164,
        role: user.role,
        status: user.status,
      },
    })
  } catch (err) {
    const rid = req.headers['x-request-id'] || 'unknown'
    logError('session_login_error', { rid, ...errorMeta(err) })
    return res.status(401).json({ error: 'Invalid credentials' })
  }
}

function normalizePhoneE164(phone: string) {
  // Assume Firebase gives E.164; keep a fallback sanitizer
  let p = phone.trim()
  if (!p.startsWith('+')) p = `+${p}`
  return p
}
