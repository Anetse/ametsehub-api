import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import promClient from 'prom-client'
import { connectDB } from './config/database'
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import uploadRoutes from './routes/uploads'
import paymentRoutes from './routes/payments'
import { rawWebhook } from './middleware/rawWebhook'

dotenv.config()
const app = express()
const PORT = process.env.PORT || '3001'

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const registry = new promClient.Registry()
promClient.collectDefaultMetrics({ register: registry })

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/uploads', uploadRoutes)
app.post('/api/payments/webhook/paystack', rawWebhook, paymentRoutes)
app.use('/api/payments', paymentRoutes)

app.get('/api/metrics', async (_req, res) => { res.setHeader('Content-Type', registry.contentType); res.end(await registry.metrics()) })
app.get('/api/health', (_req, res) => { res.json({ status: 'OK', timestamp: new Date().toISOString() }) })

connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/universe').then(() => {
  app.listen(parseInt(PORT, 10), () => {})
})

export default app

