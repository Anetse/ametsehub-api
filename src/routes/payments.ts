import { Router } from 'express'
import crypto from 'crypto'
import Payment from '../models/Payment'
import { initializePayment, verifyPayment } from '../utils/paystack'

const router = Router()

router.post('/initialize', async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY as string
    const { amount, email, currency = 'NGN', metadata = {} } = req.body
    const init = await initializePayment(secret, amount, email, metadata)
    const reference = init.data.reference
    await Payment.create({ userEmail: email, amount, currency, reference, status: 'initialized', metadata })
    res.json({ authorizationUrl: init.data.authorization_url, reference })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/verify/:reference', async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY as string
    const { reference } = req.params
    const v = await verifyPayment(secret, reference)
    const status = v.data.status === 'success' ? 'success' : 'failed'
    const payment = await Payment.findOne({ reference })
    if (payment) { payment.status = status; await payment.save() }
    res.json({ status })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/webhook/paystack', (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY as string
    const signature = req.headers['x-paystack-signature'] as string
    const body = (req as any).rawBody as Buffer
    const computed = crypto.createHmac('sha512', secret).update(body).digest('hex')
    if (!signature || signature !== computed) { res.status(401).json({ message: 'Invalid signature' }); return }
    const event = (JSON.parse(body.toString()) as any)
    if (event.event === 'charge.success') {
      const reference = event.data.reference
      Payment.findOneAndUpdate({ reference }, { status: 'success' }).exec()
    }
    res.json({ received: true })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

export default router

