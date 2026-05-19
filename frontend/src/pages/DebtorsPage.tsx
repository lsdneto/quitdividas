import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import type { Debtor } from '../types'

const initialForm = { name: '', document: '', phone: '', email: '', address: '' }

export function DebtorsPage() {
  const { token } = useAuth()
  const [debtors, setDebtors] = useState<Debtor[]>([])
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    let active = true

    ;(async () => {
      try {
        const data = await api.request<Debtor[]>('/devedores', {}, token || undefined)
        if (active) setDebtors(data)
      } catch {
        if (active) setDebtors([])
      }
    })()

    return () => {
      active = false
    }
  }, [token])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const created = await api.request<Debtor>('/devedores', {
      method: 'POST',
      body: JSON.stringify(form),
    }, token || undefined)

    setDebtors((prev) => [created, ...prev])
    setForm(initialForm)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Devedores</h1>
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2">
        {Object.entries(form).map(([key, value]) => (
          <label key={key} className="block">
            <span className="mb-1 block text-sm capitalize">{key}</span>
            <input
              className="w-full rounded border p-2"
              value={value}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              required={key !== 'address'}
            />
          </label>
        ))}
        <button className="rounded bg-slate-900 px-4 py-2 text-white md:col-span-2">Cadastrar devedor</button>
      </form>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Documento</th>
              <th className="p-3 text-left">Contato</th>
            </tr>
          </thead>
          <tbody>
            {debtors.map((debtor) => (
              <tr key={debtor.id} className="border-t">
                <td className="p-3">
                  <Link to={`/devedores/${debtor.id}`} className="font-medium no-underline">
                    {debtor.name}
                  </Link>
                </td>
                <td className="p-3">{debtor.document}</td>
                <td className="p-3">{debtor.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
