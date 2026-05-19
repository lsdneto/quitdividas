import { Request, Response } from 'express'
import { AppDataSource } from '../database/data-source'
import { Devedor } from '../models/Devedor'

export async function listDevedores(_req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Devedor)
  const data = await repo.find({ order: { createdAt: 'DESC' } })
  return res.json(data)
}

export async function getDevedor(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Devedor)
  const data = await repo.findOne({ where: { id: Number(req.params.id) } })
  if (!data) return res.status(404).json({ message: 'Devedor não encontrado' })
  return res.json(data)
}

export async function createDevedor(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Devedor)
  const exists = await repo.findOne({ where: { document: req.body.document } })
  if (exists) return res.status(409).json({ message: 'Documento já cadastrado' })

  const created = repo.create(req.body)
  await repo.save(created)
  return res.status(201).json(created)
}

export async function updateDevedor(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Devedor)
  const devedor = await repo.findOne({ where: { id: Number(req.params.id) } })
  if (!devedor) return res.status(404).json({ message: 'Devedor não encontrado' })

  repo.merge(devedor, req.body)
  await repo.save(devedor)
  return res.json(devedor)
}

export async function deleteDevedor(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Devedor)
  const data = await repo.findOne({ where: { id: Number(req.params.id) } })
  if (!data) return res.status(404).json({ message: 'Devedor não encontrado' })

  await repo.remove(data)
  return res.status(204).send()
}
