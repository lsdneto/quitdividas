import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodTypeAny } from 'zod'

export function validate(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      return next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({ message: 'Dados inválidos', issues: error.issues })
      }
      return next(error)
    }
  }
}
