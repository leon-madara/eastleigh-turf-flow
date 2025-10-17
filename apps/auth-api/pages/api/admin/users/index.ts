import type { NextApiRequest, NextApiResponse } from 'next'
import { handleCors } from '../../../../utils/cors'
import { requireUser } from '../../../../utils/authUser'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const corsPreflight = handleCors(req, res)
  if (corsPreflight) return
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const admin = await requireUser(req, res, { requireActive: true, requireAdmin: true })
  if (!admin) return

  const { page = '1', pageSize = '10', status, role, q } = req.query
  const pageNum = Math.max(1, parseInt(String(page), 10) || 1)
  const sizeNum = Math.min(100, Math.max(1, parseInt(String(pageSize), 10) || 10))
  const skip = (pageNum - 1) * sizeNum

  const where: any = {}
  if (status && ['PENDING', 'ACTIVE', 'BLOCKED'].includes(String(status))) where.status = String(status)
  if (role && ['BROKER', 'ADMIN'].includes(String(role))) where.role = String(role)
  if (q && String(q).trim()) {
    where.OR = [{ phoneE164: { contains: String(q).trim(), mode: 'insensitive' } }]
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: sizeNum }),
  ])
  const totalPages = Math.ceil(total / sizeNum)
  return res.status(200).json({ users, page: pageNum, pageSize: sizeNum, total, totalPages })
}
