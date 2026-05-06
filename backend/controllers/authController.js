import { sendOTPSMS ,verifyOTPSMS } from '../utils/sendSMS.js'
import User from '../models/User.js'

export const login = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username, password })
  if (!user) return res.status(401).json({ message: 'Wrong username or password' })
  res.json({ success: true })
}


// OTP bhejo
export const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body
    console.log('phone number received:', phone)
    const user = await User.findOne({ phone })
    console.log('User found:', user)
    if (!user) return res.status(404).json({ message: 'phone number  not found!' })
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 10 * 60 * 1000)
    
    await User.findByIdAndUpdate(user._id, { otp, otpExpiry: expiry })
    await sendOTPSMS(phone, otp)
    
    res.json({ success: true, message: 'OTP sent!' })
  } catch (err) {
    console.error('Error:', err) // ← yeh add karo
    res.status(500).json({ message: err.message })
  }
}
// OTP verify karo
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body
    const result = await verifyOTPSMS(phone, otp)
    if (result.status !== 'approved') return res.status(400).json({ message: 'Wrong OTP!' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Naya password set karo
export const resetPassword = async (req, res) => {
  try{
  const { phone, newUsername, newPassword } = req.body
  await User.findOneAndUpdate({ phone }, { username: newUsername, password: newPassword, otp: null })
  res.json({ success: true, message: 'Password reset!' })
}catch(err){
  res.status(500).json({message: err.message})
}
}

