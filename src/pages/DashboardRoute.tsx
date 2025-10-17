import React from 'react'
import { useAuth } from '@/components/AuthProvider'
import BrokerDashboard from '@/components/BrokerDashboard'

const DashboardRoute = () => {
  const { logout } = useAuth()
  return <BrokerDashboard onLogout={logout} />
}

export default DashboardRoute

