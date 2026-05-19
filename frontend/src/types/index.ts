export type DebtStatus = 'pendente' | 'parcial' | 'quitada'

export interface User {
  id: number
  name: string
  email: string
}

export interface Debtor {
  id: number
  name: string
  document: string
  phone: string
  email: string
  address: string
  createdAt: string
}

export interface Debt {
  id: number
  debtorId: number
  description: string
  principalAmount: number
  interestRate: number
  issueDate: string
  dueDate?: string
  paidAmount: number
  status: DebtStatus
  currentAmount: number
}

export interface Payment {
  id: number
  debtId: number
  amount: number
  paymentDate: string
  notes?: string
}

export interface DashboardSummary {
  totalDebtors: number
  totalDebts: number
  pendingDebts: number
  totalOpenAmount: number
  totalPaidAmount: number
  byStatus: { status: DebtStatus; total: number }[]
}
