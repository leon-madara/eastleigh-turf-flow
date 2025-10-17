import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiJson, MeResponse } from '@/lib/api'

type AuthUser = { uid: string; phone?: string | null; role?: 'BROKER' | 'ADMIN'; status?: 'PENDING' | 'ACTIVE' | 'BLOCKED' }
type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
  pendingApproval: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingApproval, setPendingApproval] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const data = await apiJson<MeResponse>('/api/auth/me', { method: 'GET' })
      setUser(data.user)
      setPendingApproval(false)
    } catch {
      setUser(null)
      // Determine if it's pending approval (403)
      try {
        const resp = await fetch(((import.meta.env.VITE_AUTH_API_BASE as string) || '') + '/api/auth/me', { credentials: 'include' })
        if (resp.status === 403) setPendingApproval(true)
        else setPendingApproval(false)
      } catch {
        setPendingApproval(false)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiJson<{ ok: boolean }>('/api/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout, pendingApproval }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
