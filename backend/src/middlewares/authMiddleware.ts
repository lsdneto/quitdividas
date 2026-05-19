import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'Token não informado' })

  const [bearer, token] = auth.split(' ')
  if (bearer !== 'Bearer' || !token) return res.status(401).json({ message: 'Token inválido' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'troque-esta-chave')
    req.user = payload as Request['user']
    return next()
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }
}
