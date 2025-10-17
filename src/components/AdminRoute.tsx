import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/components/AuthProvider'

type Props = { children: React.ReactElement }

const AdminRoute = ({ children }: Props) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!user) return <Navigate to="/" replace state={{ from: location }} />
  if (user.status !== 'ACTIVE' || user.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}

export default AdminRoute

