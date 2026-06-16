import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String },
  email:    { type: String },
  role:     { type: String, enum: ['admin', 'staff'], default: 'staff' }, // ← ADD
  otp:      { type: String },
  otpExpiry:{ type: Date },
})

export default mongoose.model('User', userSchema)