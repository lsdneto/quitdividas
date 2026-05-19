import { Request, Response } from 'express'
import { AppDataSource } from '../database/data-source'
import { Divida } from '../models/Divida'
import { Pagamento } from '../models/Pagamento'
import { refreshDebtDebtState } from './dividaController'

export async function listPagamentos(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Pagamento)
  const debtId = req.query.debtId ? Number(req.query.debtId) : undefined
  const data = await repo.find({ where: debtId ? { debtId } : {}, order: { paymentDate: 'DESC' } })
  return res.json(data.map((item) => ({ ...item, amount: Number(item.amount) })))
}

export async function getPagamento(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Pagamento)
  const data = await repo.findOne({ where: { id: Number(req.params.id) } })
  if (!data) return res.status(404).json({ message: 'Pagamento não encontrado' })
  return res.json({ ...data, amount: Number(data.amount) })
}

export async function createPagamento(req: Request, res: Response) {
  const debtRepo = AppDataSource.getRepository(Divida)
  const debt = await debtRepo.findOne({ where: { id: req.body.debtId } })
  if (!debt) return res.status(404).json({ message: 'Dívida não encontrada' })

  const repo = AppDataSource.getRepository(Pagamento)
  const payload: Partial<Pagamento> = {
    ...req.body,
    amount: req.body.amount.toFixed(2),
    paymentDate: new Date(req.body.paymentDate),
    notes: req.body.notes || null,
  }
  const created = repo.create(payload)

  await repo.save(created)
  await refreshDebtDebtState(created.debtId)
  return res.status(201).json({ ...created, amount: Number(created.amount) })
}

export async function updatePagamento(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Pagamento)
  const pagamento = await repo.findOne({ where: { id: Number(req.params.id) } })
  if (!pagamento) return res.status(404).json({ message: 'Pagamento não encontrado' })

  repo.merge(pagamento, {
    ...req.body,
    amount: req.body.amount?.toFixed(2) ?? pagamento.amount,
    paymentDate: req.body.paymentDate ? new Date(req.body.paymentDate) : pagamento.paymentDate,
  })

  await repo.save(pagamento)
  await refreshDebtDebtState(pagamento.debtId)
  return res.json({ ...pagamento, amount: Number(pagamento.amount) })
}

export async function deletePagamento(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Pagamento)
  const pagamento = await repo.findOne({ where: { id: Number(req.params.id) } })
  if (!pagamento) return res.status(404).json({ message: 'Pagamento não encontrado' })

  const debtId = pagamento.debtId
  await repo.remove(pagamento)
  await refreshDebtDebtState(debtId)
  return res.status(204).send()
}
