import { Router } from 'express'
import { dashboard, relatorios } from '../controllers/reportController'

const router = Router()

router.get('/dashboard', dashboard)
router.get('/relatorios', relatorios)

export default router
