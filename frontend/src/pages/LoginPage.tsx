import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@quitdividas.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      setError('')
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold">Entrar</h1>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm">E-mail</span>
          <input
            className="w-full rounded border p-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-sm">Senha</span>
          <input
            className="w-full rounded border p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-slate-900 px-4 py-2 text-white" type="submit">
          Acessar
        </button>
      </form>
    </div>
  )
}
