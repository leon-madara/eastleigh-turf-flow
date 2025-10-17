import type { NextApiRequest, NextApiResponse } from 'next'
import { handleCors } from '../../../utils/cors'
import { requireUser } from '../../../utils/authUser'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const corsPreflight = handleCors(req, res)
  if (corsPreflight) return
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const admin = await requireUser(req, res, { requireActive: true, requireAdmin: true })
  if (!admin) return

  const [total, pending, active, blocked, admins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { status: 'BLOCKED' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
  ])

  return res.status(200).json({ total, pending, active, blocked, admins })
}

