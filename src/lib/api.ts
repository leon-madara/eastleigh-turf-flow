const API_BASE = (import.meta.env.VITE_AUTH_API_BASE as string) || ''

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    credentials: 'include',
    ...init,
  })
  if (!res.ok) {
    let msg = 'Request failed'
    try {
      const data = await res.json()
      msg = data?.error || msg
    } catch {}
    const err: any = new Error(msg)
    err.status = res.status
    throw err
  }
  return res.json() as Promise<T>
}

export type AppUser = { uid: string; phone?: string | null; role?: 'BROKER' | 'ADMIN'; status?: 'PENDING' | 'ACTIVE' | 'BLOCKED' }
export type MeResponse = { user: AppUser }
