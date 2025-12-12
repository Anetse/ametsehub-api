import mongoose, { Schema, Document } from 'mongoose'

export interface IPayment extends Document {
  userEmail: string
  amount: number
  currency: string
  reference: string
  status: 'initialized' | 'success' | 'failed'
  metadata?: any
}

const PaymentSchema = new Schema<IPayment>({
  userEmail: String,
  amount: Number,
  currency: String,
  reference: { type: String, unique: true },
  status: { type: String, default: 'initialized' },
  metadata: Schema.Types.Mixed
}, { timestamps: true })

export default mongoose.model<IPayment>('Payment', PaymentSchema)

