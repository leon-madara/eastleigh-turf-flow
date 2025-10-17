import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiJson } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type User = {
  id: string
  uid: string
  phoneE164: string
  role: 'BROKER' | 'ADMIN'
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED'
  createdAt: string
}

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') usp.set(k, String(v))
  })
  const s = usp.toString()
  return s ? `?${s}` : ''
}

const fetchUsers = (args: { page: number; pageSize: number; status?: string; role?: string; q?: string }) =>
  apiJson<{ users: User[]; page: number; pageSize: number; total: number; totalPages: number }>(
    `/api/admin/users${buildQuery(args)}`,
    { method: 'GET' }
  )
const updateUser = (id: string, body: Partial<Pick<User, 'status' | 'role'>>) =>
  apiJson<{ user: User }>(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) })

type Metrics = { total: number; pending: number; active: number; blocked: number; admins: number }
const fetchMetrics = () => apiJson<Metrics>('/api/admin/metrics', { method: 'GET' })

const AdminPage = () => {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [status, setStatus] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [q, setQ] = useState('')

  const queryArgs = useMemo(() => ({ page, pageSize, status: status || undefined, role: role || undefined, q: q || undefined }), [page, pageSize, status, role, q])
  const { data, isLoading, error } = useQuery({ queryKey: ['admin-users', queryArgs], queryFn: () => fetchUsers(queryArgs) })
  const metricsQuery = useQuery({ queryKey: ['admin-metrics'], queryFn: fetchMetrics })
  const mutate = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Pick<User, 'status' | 'role'>> }) => updateUser(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const allSelected = users.length > 0 && users.every(u => selected[u.id])
  const toggleAll = () => {
    const next: Record<string, boolean> = {}
    const val = !allSelected
    users.forEach(u => { next[u.id] = val })
    setSelected(next)
  }
  const selectedIds = users.filter(u => selected[u.id]).map(u => u.id)
  const hasSelected = selectedIds.length > 0

  // Bulk actions
  const bulkUpdate = async (body: Partial<Pick<User,'status'|'role'>>) => {
    await Promise.all(selectedIds.map(id => updateUser(id, body)))
    setSelected({})
    qc.invalidateQueries({ queryKey: ['admin-users'] })
  }

  // CSV export
  const toCsv = (rows: User[]) => {
    const headers = ['id','uid','phoneE164','role','status','createdAt']
    const lines = [headers.join(',')]
    rows.forEach(r => {
      lines.push([r.id,r.uid,r.phoneE164,r.role,r.status,r.createdAt].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))
    })
    return lines.join('\n')
  }
  const download = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  const exportCurrent = () => download('users_current.csv', toCsv(users))
  const exportAll = async () => {
    // page through all results with current filters
    const all: User[] = []
    let p = 1
    const size = 100
    while (true) {
      const res = await fetchUsers({ ...queryArgs, page: p, pageSize: size })
      all.push(...res.users)
      if (p >= res.totalPages) break
      p++
    }
    download('users_all.csv', toCsv(all))
  }

  if (isLoading) return null
  if (error) return <div className="p-6">Failed to load users</div>

  const users = data?.users || []
  const total = data?.total || 0
  const totalPages = data?.totalPages || 1

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Metrics summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <MetricCard label="Total" value={metricsQuery.data?.total ?? 0} />
          <MetricCard label="Pending" value={metricsQuery.data?.pending ?? 0} color="yellow" />
          <MetricCard label="Active" value={metricsQuery.data?.active ?? 0} color="green" />
          <MetricCard label="Blocked" value={metricsQuery.data?.blocked ?? 0} color="red" />
          <MetricCard label="Admins" value={metricsQuery.data?.admins ?? 0} color="purple" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Admin — Brokers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <input
                value={q}
                onChange={(e) => { setPage(1); setQ(e.target.value) }}
                placeholder="Search phone"
                className="border px-2 py-1 rounded text-sm"
              />
              <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }} className="border px-2 py-1 rounded text-sm">
                <option value="">All Status</option>
                <option value="PENDING">PENDING</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
              <select value={role} onChange={(e) => { setPage(1); setRole(e.target.value) }} className="border px-2 py-1 rounded text-sm">
                <option value="">All Roles</option>
                <option value="BROKER">BROKER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <select value={pageSize} onChange={(e) => { setPage(1); setPageSize(parseInt(e.target.value, 10)) }} className="border px-2 py-1 rounded text-sm">
                {[10, 20, 50].map(s => <option key={s} value={s}>{s}/page</option>)}
              </select>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={exportCurrent}>Export CSV (current)</Button>
                <Button size="sm" variant="outline" onClick={exportAll}>Export CSV (all)</Button>
                <span className="text-sm text-muted-foreground">{users.length ? `${(page-1)*pageSize+1}–${Math.min(page*pageSize, total)} of ${total}` : `0 of ${total}`}</span>
              </div>
            </div>

            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between border p-3 rounded">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={!!selected[u.id]} onChange={(e) => setSelected(prev => ({ ...prev, [u.id]: e.target.checked }))} />
                    <div className="text-sm">
                      <div className="font-medium">{u.phoneE164}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <RoleBadge role={u.role} />
                        <StatusBadge status={u.status} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {u.status !== 'ACTIVE' && (
                      <Button size="sm" onClick={() => mutate.mutate({ id: u.id, body: { status: 'ACTIVE' } })}>Activate</Button>
                    )}
                    {u.status !== 'BLOCKED' && (
                      <Button size="sm" variant="destructive" onClick={() => mutate.mutate({ id: u.id, body: { status: 'BLOCKED' } })}>Block</Button>
                    )}
                    {u.role !== 'ADMIN' && (
                      <Button size="sm" variant="outline" onClick={() => mutate.mutate({ id: u.id, body: { role: 'ADMIN' } })}>Make Admin</Button>
                    )}
                    {u.role !== 'BROKER' && (
                      <Button size="sm" variant="outline" onClick={() => mutate.mutate({ id: u.id, body: { role: 'BROKER' } })}>Make Broker</Button>
                    )}
                  </div>
                </div>
              ))}
              {users.length === 0 && <div className="text-sm text-muted-foreground">No users yet.</div>}
              {users.length > 0 && (
                <div className="flex items-center gap-2 border p-3 rounded">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                  <span className="text-sm">Select all on page</span>
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="secondary" disabled={!hasSelected} onClick={() => bulkUpdate({ status: 'ACTIVE' })}>Activate Selected</Button>
                    <Button size="sm" variant="destructive" disabled={!hasSelected} onClick={() => bulkUpdate({ status: 'BLOCKED' })}>Block Selected</Button>
                    <Button size="sm" variant="outline" disabled={!hasSelected} onClick={() => bulkUpdate({ role: 'ADMIN' })}>Make Admin</Button>
                    <Button size="sm" variant="outline" disabled={!hasSelected} onClick={() => bulkUpdate({ role: 'BROKER' })}>Make Broker</Button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-4">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                <div className="text-sm">Page {page} of {totalPages}</div>
                <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminPage

const MetricCard = ({ label, value, color }: { label: string; value: number; color?: 'yellow'|'green'|'red'|'purple' }) => {
  const colorMap: any = {
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  }
  return (
    <div className={`border rounded p-3 ${color ? colorMap[color] : ''}`}>
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}

const RoleBadge = ({ role }: { role: User['role'] }) => (
  <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>{role}</nBadge>
)

const StatusBadge = ({ status }: { status: User['status'] }) => {
  const style =
    status === 'ACTIVE' ? 'bg-green-600' : status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-600'
  return <span className={`px-2 py-0.5 text-[11px] rounded text-white ${style}`}>{status}</span>
}
