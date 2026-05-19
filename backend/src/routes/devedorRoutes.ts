import { Router } from 'express'
import {
  createDevedor,
  deleteDevedor,
  getDevedor,
  listDevedores,
  updateDevedor,
} from '../controllers/devedorController'
import { validate } from '../middlewares/validate'
import { debtorSchema } from '../services/validationSchemas'

const router = Router()

router.get('/', listDevedores)
router.get('/:id', getDevedor)
router.post('/', validate(debtorSchema), createDevedor)
router.put('/:id', validate(debtorSchema.partial()), updateDevedor)
router.delete('/:id', deleteDevedor)

export default router
