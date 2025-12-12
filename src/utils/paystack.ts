import axios from 'axios'

const BASE = 'https://api.paystack.co'

export async function initializePayment(secret: string, amount: number, email: string, metadata: any) {
  const res = await axios.post(BASE + '/transaction/initialize', { amount: amount * 100, email, metadata }, { headers: { Authorization: `Bearer ${secret}`, 'Content-Type':'application/json' } })
  return res.data
}

export async function verifyPayment(secret: string, reference: string) {
  const res = await axios.get(BASE + `/transaction/verify/${reference}`, { headers: { Authorization: `Bearer ${secret}` } })
  return res.data
}

