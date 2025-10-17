import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminAuth } from '../lib/firebaseAdmin'
import { getSessionCookie } from './cookies'
import { prisma } from '../lib/prisma'

export async function getCurrentUser(req: NextApiRequest) {
  const cookieName = process.env.SESSION_COOKIE_NAME || 'sid'
  const cookie = getSessionCookie(req, cookieName)
  if (!cookie) return null
  const auth = getAdminAuth()
  const decoded = await auth.verifySessionCookie(cookie, true).catch(() => null)
  if (!decoded) return null
  const uid = decoded.uid
  const user = await prisma.user.findUnique({ where: { uid } })
  return user
}

export async function requireUser(
  req: NextApiRequest,
  res: NextApiResponse,
  options?: { requireActive?: boolean; requireAdmin?: boolean }
) {
  const user = await getCurrentUser(req)
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }
  if (options?.requireActive && user.status !== 'ACTIVE') {
    res.status(403).json({ error: 'Not approved' })
    return null
  }
  if (options?.requireAdmin && user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Admin required' })
    return null
  }
  return user
}

