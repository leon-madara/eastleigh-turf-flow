import type { NextApiRequest, NextApiResponse } from 'next'
import { handleCors } from '../../../../utils/cors'
import { requireUser } from '../../../../utils/authUser'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const corsPreflight = handleCors(req, res)
  if (corsPreflight) return

  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const admin = await requireUser(req, res, { requireActive: true, requireAdmin: true })
  if (!admin) return

  const { id } = req.query
  const { status, role } = req.body || {}

  const data: any = {}
  if (status && ['PENDING', 'ACTIVE', 'BLOCKED'].includes(status)) data.status = status
  if (role && ['BROKER', 'ADMIN'].includes(role)) data.role = role

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'No valid fields' })
  }

  const user = await prisma.user.update({ where: { id: String(id) }, data })
  return res.status(200).json({ user })
}

