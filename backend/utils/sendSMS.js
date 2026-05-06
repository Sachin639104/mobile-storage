import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export const sendOTPSMS = async (phone) => {
  const res = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verifications.create({
      to: `+91${phone}`,
      channel: 'sms'
    })
  console.log('SMS sent:', res.status)
  return res
}

export const verifyOTPSMS = async (phone, otp) => {
  const res = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verificationChecks.create({
      to: `+91${phone}`,
      code: otp
    })
  console.log('Verify status:', res.status)
  return res
}