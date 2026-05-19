import { useEffect, useState } from 'react'
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { SummaryCard } from '../components/SummaryCard'
import type { DashboardSummary } from '../types'

const COLORS = ['#f59e0b', '#3b82f6', '#10b981']

export function DashboardPage() {
  const { token } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    api
      .request<DashboardSummary>('/dashboard', {}, token || undefined)
      .then(setSummary)
      .catch(() => setSummary(null))
  }, [token])

  if (!summary) return <p>Carregando dashboard...</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-5">
        <SummaryCard title="Devedores" value={String(summary.totalDebtors)} />
        <SummaryCard title="Dívidas" value={String(summary.totalDebts)} />
        <SummaryCard title="Pendentes" value={String(summary.pendingDebts)} />
        <SummaryCard title="Total Aberto" value={`R$ ${summary.totalOpenAmount.toFixed(2)}`} />
        <SummaryCard title="Total Pago" value={`R$ ${summary.totalPaidAmount.toFixed(2)}`} />
      </div>
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-4 text-lg font-medium">Dívidas por status</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={summary.byStatus} dataKey="total" nameKey="status" outerRadius={100}>
                {summary.byStatus.map((entry, index) => (
                  <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
