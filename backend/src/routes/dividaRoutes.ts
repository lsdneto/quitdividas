import { Router } from 'express'
import {
  createDivida,
  deleteDivida,
  getDivida,
  listDividas,
  updateDivida,
} from '../controllers/dividaController'
import { validate } from '../middlewares/validate'
import { debtSchema } from '../services/validationSchemas'

const router = Router()

router.get('/', listDividas)
router.get('/:id', getDivida)
router.post('/', validate(debtSchema), createDivida)
router.put('/:id', validate(debtSchema.partial()), updateDivida)
router.delete('/:id', deleteDivida)

export default router
