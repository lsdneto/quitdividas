import { Divida } from '../models/Divida'

function monthsBetween(from: Date, to: Date): number {
  const msInMonth = 1000 * 60 * 60 * 24 * 30
  const diff = Math.max(0, to.getTime() - from.getTime())
  return diff / msInMonth
}

export function calculateCurrentAmount(divida: Divida, referenceDate = new Date()): number {
  const principal = Number(divida.principalAmount)
  const rate = Number(divida.interestRate) / 100
  const start = new Date(divida.issueDate)
  const periods = monthsBetween(start, referenceDate)
  return principal * Math.pow(1 + rate, periods)
}

export function calculateStatus(currentAmount: number, paidAmount: number): Divida['status'] {
  if (paidAmount >= currentAmount) return 'quitada'
  if (paidAmount > 0) return 'parcial'
  return 'pendente'
}
