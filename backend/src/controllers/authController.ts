import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../database/data-source'
import { User } from '../models/User'

function tokenFor(user: User) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'troque-esta-chave', {
    expiresIn: '1d',
  })
}

export async function register(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(User)
  const exists = await repo.findOne({ where: { email: req.body.email } })
  if (exists) return res.status(409).json({ message: 'E-mail já cadastrado' })

  const passwordHash = await bcrypt.hash(req.body.password, 10)
  const user = repo.create({ name: req.body.name, email: req.body.email, passwordHash })
  await repo.save(user)
  return res.status(201).json({ token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email } })
}

export async function login(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(User)
  const user = await repo.findOne({ where: { email: req.body.email } })
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' })

  const valid = await bcrypt.compare(req.body.password, user.passwordHash)
  if (!valid) return res.status(401).json({ message: 'Credenciais inválidas' })

  return res.json({ token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email } })
}
