import { Request, Response } from 'express'
import { AppDataSource } from '../database/data-source'
import { Divida } from '../models/Divida'
import { Devedor } from '../models/Devedor'
import { Pagamento } from '../models/Pagamento'
import { calculateCurrentAmount, calculateStatus } from '../services/debtCalculator'

function enrichDebt(divida: Divida) {
  const currentAmount = calculateCurrentAmount(divida)
  const paidAmount = Number(divida.paidAmount)
  return {
    ...divida,
    principalAmount: Number(divida.principalAmount),
    interestRate: Number(divida.interestRate),
    paidAmount,
    currentAmount,
    status: calculateStatus(currentAmount, paidAmount),
  }
}

async function refreshDebtDebtState(debtId: number) {
  const debtRepo = AppDataSource.getRepository(Divida)
  const paymentRepo = AppDataSource.getRepository(Pagamento)
  const debt = await debtRepo.findOne({ where: { id: debtId } })
  if (!debt) return

  const payments = await paymentRepo.find({ where: { debtId } })
  const paidAmount = payments.reduce((acc, item) => acc + Number(item.amount), 0)
  const currentAmount = calculateCurrentAmount(debt)
  debt.paidAmount = paidAmount.toFixed(2)
  debt.status = calculateStatus(currentAmount, paidAmount)
  await debtRepo.save(debt)
}

export async function listDividas(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Divida)
  const debtorId = req.query.debtorId ? Number(req.query.debtorId) : undefined
  const data = await repo.find({ where: debtorId ? { debtorId } : {}, order: { createdAt: 'DESC' } })
  return res.json(data.map(enrichDebt))
}

export async function getDivida(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Divida)
  const data = await repo.findOne({ where: { id: Number(req.params.id) } })
  if (!data) return res.status(404).json({ message: 'Dívida não encontrada' })
  return res.json(enrichDebt(data))
}

export async function createDivida(req: Request, res: Response) {
  const devedorRepo = AppDataSource.getRepository(Devedor)
  const devedor = await devedorRepo.findOne({ where: { id: req.body.debtorId } })
  if (!devedor) return res.status(404).json({ message: 'Devedor não encontrado' })

  const repo = AppDataSource.getRepository(Divida)
  const payload: Partial<Divida> = {
    ...req.body,
    principalAmount: req.body.principalAmount.toFixed(2),
    interestRate: req.body.interestRate.toFixed(4),
    dueDate: req.body.dueDate || null,
    paidAmount: '0.00',
    status: 'pendente',
  }
  const created = repo.create(payload)
  await repo.save(created)
  return res.status(201).json(enrichDebt(created))
}

export async function updateDivida(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Divida)
  const divida = await repo.findOne({ where: { id: Number(req.params.id) } })
  if (!divida) return res.status(404).json({ message: 'Dívida não encontrada' })

  repo.merge(divida, {
    ...req.body,
    principalAmount: req.body.principalAmount?.toFixed(2) ?? divida.principalAmount,
    interestRate: req.body.interestRate?.toFixed(4) ?? divida.interestRate,
  })

  await repo.save(divida)
  await refreshDebtDebtState(divida.id)
  const refreshed = await repo.findOne({ where: { id: divida.id } })
  return res.json(enrichDebt(refreshed!))
}

export async function deleteDivida(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Divida)
  const data = await repo.findOne({ where: { id: Number(req.params.id) } })
  if (!data) return res.status(404).json({ message: 'Dívida não encontrada' })

  await repo.remove(data)
  return res.status(204).send()
}

export { refreshDebtDebtState }
