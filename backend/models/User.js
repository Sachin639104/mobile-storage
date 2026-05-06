import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },

})

export default mongoose.model('User', userSchema)