import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  role: 'student' | 'employer' | 'admin'
  firstName?: string
  lastName?: string
  username?: string
  isVerified: boolean
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student','employer','admin'], default: 'student' },
  firstName: String,
  lastName: String,
  username: String,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model<IUser>('User', UserSchema)

