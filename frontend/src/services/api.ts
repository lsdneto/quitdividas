const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ message: 'Erro inesperado' }))
    throw new Error(data.message || 'Erro na requisição')
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  request,
}
