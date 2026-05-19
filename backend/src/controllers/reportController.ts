import { Request, Response } from 'express'
import { AppDataSource } from '../database/data-source'
import { Divida } from '../models/Divida'
import { Devedor } from '../models/Devedor'
import { calculateCurrentAmount, calculateStatus } from '../services/debtCalculator'

export async function dashboard(req: Request, res: Response) {
  const devedorRepo = AppDataSource.getRepository(Devedor)
  const dividaRepo = AppDataSource.getRepository(Divida)

  const [devedores, dividas] = await Promise.all([devedorRepo.find(), dividaRepo.find()])

  const summary = dividas.map((divida) => {
    const currentAmount = calculateCurrentAmount(divida)
    const paidAmount = Number(divida.paidAmount)
    return {
      status: calculateStatus(currentAmount, paidAmount),
      currentAmount,
      paidAmount,
    }
  })

  const byStatus = ['pendente', 'parcial', 'quitada'].map((status) => ({
    status,
    total: summary.filter((item) => item.status === status).length,
  }))

  return res.json({
    totalDebtors: devedores.length,
    totalDebts: dividas.length,
    pendingDebts: summary.filter((item) => item.status !== 'quitada').length,
    totalOpenAmount: Number(summary.reduce((acc, item) => acc + (item.currentAmount - item.paidAmount), 0).toFixed(2)),
    totalPaidAmount: Number(summary.reduce((acc, item) => acc + item.paidAmount, 0).toFixed(2)),
    byStatus,
  })
}

export async function relatorios(req: Request, res: Response) {
  const dividaRepo = AppDataSource.getRepository(Divida)
  const data = await dividaRepo.find({ relations: { devedor: true }, order: { createdAt: 'DESC' } })

  const report = data
    .map((divida) => {
      const currentAmount = calculateCurrentAmount(divida)
      const paidAmount = Number(divida.paidAmount)
      const status = calculateStatus(currentAmount, paidAmount)
      return {
        debtId: divida.id,
        debtorName: divida.devedor.name,
        description: divida.description,
        status,
        currentAmount: Number(currentAmount.toFixed(2)),
        paidAmount,
      }
    })
    .filter((item) => !req.query.status || item.status === req.query.status)

  return res.json(report)
}
