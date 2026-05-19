import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import type { Payment } from '../types'

export function RegisterPaymentPage() {
  const { debtId } = useParams()
  const { token } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [amount, setAmount] = useState('')

  useEffect(() => {
    let active = true

    ;(async () => {
      try {
        const data = await api.request<Payment[]>(`/pagamentos?debtId=${debtId}`, {}, token || undefined)
        if (active) setPayments(data)
      } catch {
        if (active) setPayments([])
      }
    })()

    return () => {
      active = false
    }
  }, [debtId, token])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const created = await api.request<Payment>('/pagamentos', {
      method: 'POST',
      body: JSON.stringify({ debtId: Number(debtId), amount: Number(amount), paymentDate: new Date().toISOString() }),
    }, token || undefined)

    setPayments((prev) => [created, ...prev])
    setAmount('')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Registrar Pagamento</h1>
      <form onSubmit={handleSubmit} className="flex gap-3 rounded-lg border bg-white p-4">
        <input
          className="w-full rounded border p-2"
          type="number"
          min="0"
          step="0.01"
          placeholder="Valor pago"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button className="rounded bg-slate-900 px-4 py-2 text-white">Salvar</button>
      </form>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 text-lg font-medium">Pagamentos</h2>
        {payments.length === 0 && <p>Nenhum pagamento registrado.</p>}
        <ul className="space-y-2">
          {payments.map((payment) => (
            <li key={payment.id} className="flex justify-between rounded border p-2">
              <span>{new Date(payment.paymentDate).toLocaleDateString('pt-BR')}</span>
              <span>R$ {payment.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
