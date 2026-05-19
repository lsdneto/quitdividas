import { Router } from 'express'
import {
  createPagamento,
  deletePagamento,
  getPagamento,
  listPagamentos,
  updatePagamento,
} from '../controllers/pagamentoController'
import { validate } from '../middlewares/validate'
import { paymentSchema } from '../services/validationSchemas'

const router = Router()

router.get('/', listPagamentos)
router.get('/:id', getPagamento)
router.post('/', validate(paymentSchema), createPagamento)
router.put('/:id', validate(paymentSchema.partial()), updatePagamento)
router.delete('/:id', deletePagamento)

export default router
