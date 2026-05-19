import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(3).max(150),
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export const debtorSchema = z.object({
  name: z.string().min(3).max(150),
  document: z.string().min(5).max(30),
  phone: z.string().min(8).max(30),
  email: z.string().email(),
  address: z.string().max(255).optional().default(''),
})

export const debtSchema = z.object({
  debtorId: z.number().int().positive(),
  description: z.string().min(3).max(200),
  principalAmount: z.number().positive(),
  interestRate: z.number().min(0).max(100),
  issueDate: z.string().date(),
  dueDate: z.string().date().optional(),
})

export const paymentSchema = z.object({
  debtId: z.number().int().positive(),
  amount: z.number().positive(),
  paymentDate: z.string().datetime(),
  notes: z.string().max(255).optional(),
})
