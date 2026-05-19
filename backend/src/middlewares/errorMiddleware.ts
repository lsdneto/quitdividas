import { NextFunction, Request, Response } from 'express'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: 'Rota não encontrada' })
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  res.status(400).json({ message: error.message || 'Erro interno' })
}
