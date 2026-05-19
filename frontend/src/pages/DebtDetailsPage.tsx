import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import type { Debt } from '../types'

export function DebtDetailsPage() {
  const { debtorId } = useParams()
  const { token } = useAuth()
  const [debts, setDebts] = useState<Debt[]>([])
  const [form, setForm] = useState({ description: '', principalAmount: '', interestRate: '2', issueDate: '' })

  useEffect(() => {
    let active = true

    ;(async () => {
      try {
        const data = await api.request<Debt[]>(`/dividas?debtorId=${debtorId}`, {}, token || undefined)
        if (active) setDebts(data)
      } catch {
        if (active) setDebts([])
      }
    })()

    return () => {
      active = false
    }
  }, [debtorId, token])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const created = await api.request<Debt>('/dividas', {
      method: 'POST',
      body: JSON.stringify({
        debtorId: Number(debtorId),
        description: form.description,
        principalAmount: Number(form.principalAmount),
        interestRate: Number(form.interestRate),
        issueDate: form.issueDate,
      }),
    }, token || undefined)

    setDebts((prev) => [created, ...prev])
    setForm({ description: '', principalAmount: '', interestRate: '2', issueDate: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Detalhes da Dívida</h1>
        <Link to="/devedores">Voltar</Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2">
        <input className="rounded border p-2" placeholder="Descrição" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
        <input className="rounded border p-2" placeholder="Valor" type="number" min="0" step="0.01" value={form.principalAmount} onChange={(e) => setForm((p) => ({ ...p, principalAmount: e.target.value }))} required />
        <input className="rounded border p-2" placeholder="Taxa de juros (%)" type="number" min="0" step="0.01" value={form.interestRate} onChange={(e) => setForm((p) => ({ ...p, interestRate: e.target.value }))} required />
        <input className="rounded border p-2" type="date" value={form.issueDate} onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))} required />
        <button className="rounded bg-slate-900 px-4 py-2 text-white md:col-span-2">Registrar dívida</button>
      </form>

      <div className="space-y-3">
        {debts.map((debt) => (
          <div key={debt.id} className="rounded-lg border bg-white p-4">
            <div className="flex justify-between">
              <strong>{debt.description}</strong>
              <span className="capitalize">{debt.status}</span>
            </div>
            <p>Principal: R$ {debt.principalAmount.toFixed(2)}</p>
            <p>Atual: R$ {debt.currentAmount.toFixed(2)}</p>
            <p>Pago: R$ {debt.paidAmount.toFixed(2)}</p>
            <Link to={`/pagamentos/${debt.id}`}>Registrar pagamento</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
