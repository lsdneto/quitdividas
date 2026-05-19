import { Router } from 'express'
import authRoutes from './authRoutes'
import devedorRoutes from './devedorRoutes'
import dividaRoutes from './dividaRoutes'
import pagamentoRoutes from './pagamentoRoutes'
import reportRoutes from './reportRoutes'
import { authMiddleware } from '../middlewares/authMiddleware'
import { authRateLimit } from '../middlewares/rateLimitMiddleware'

const router = Router()

router.use('/auth', authRateLimit, authRoutes)
router.use(authRateLimit)
router.use(authMiddleware)
router.use('/devedores', devedorRoutes)
router.use('/dividas', dividaRoutes)
router.use('/pagamentos', pagamentoRoutes)
router.use(reportRoutes)

export default router
