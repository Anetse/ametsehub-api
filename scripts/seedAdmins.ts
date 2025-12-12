import mongoose from 'mongoose'
import User from '../src/models/User'

const admins = [
  'josephametse1@gmail.com',
  'universeapp944@gmail.com',
  'queuebuster427@gmail.com'
]

async function run() {
  const uri = process.env.MONGODB_URI as string
  await mongoose.connect(uri)
  for (const email of admins) {
    const exists = await User.findOne({ email })
    if (!exists) {
      await User.create({ email, password: 'Admin123!', role: 'admin', isVerified: true })
    }
  }
  await mongoose.disconnect()
}

run().catch(err => { console.error(err); process.exit(1) })

