import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

interface ReportItem {
  debtId: number
  debtorName: string
  description: string
  status: string
  currentAmount: number
  paidAmount: number
}

export function ReportsPage() {
  const { token } = useAuth()
  const [status, setStatus] = useState('')
  const [items, setItems] = useState<ReportItem[]>([])

  useEffect(() => {
    const suffix = status ? `?status=${status}` : ''
    api.request<ReportItem[]>(`/relatorios${suffix}`, {}, token || undefined).then(setItems).catch(() => setItems([]))
  }, [status, token])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Relatórios</h1>
      <div className="rounded-lg border bg-white p-4">
        <label className="text-sm">Filtrar por status</label>
        <select className="ml-3 rounded border p-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="parcial">Parcial</option>
          <option value="quitada">Quitada</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Devedor</th>
              <th className="p-3 text-left">Descrição</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Atual</th>
              <th className="p-3 text-left">Pago</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.debtId} className="border-t">
                <td className="p-3">{item.debtorName}</td>
                <td className="p-3">{item.description}</td>
                <td className="p-3 capitalize">{item.status}</td>
                <td className="p-3">R$ {item.currentAmount.toFixed(2)}</td>
                <td className="p-3">R$ {item.paidAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
