import { Router } from 'express'
import User from '../models/User'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { email, password, role = 'student', firstName, lastName, username } = req.body
    const exists = await User.findOne({ email })
    if (exists) { res.status(400).json({ message: 'User already exists' }); return }
    const user = await User.create({ email, password, role, firstName, lastName, username })
    res.status(201).json({ user, accessToken: 'test-token' })
  } catch (e: any) {
    res.status(500).json({ message: e.message })
  }
})

export default router

