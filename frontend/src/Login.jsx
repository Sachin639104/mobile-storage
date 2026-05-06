import { useState } from 'react'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [step, setStep] = useState('login') // login, forgot, otp, reset
const [phone, setPhone] = useState('')
const [otp, setOtp] = useState('')
const [newUsername, setNewUsername] = useState('')
const [newPassword, setNewPassword] = useState('')
const [success, setSuccess] = useState('')

{/*
  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      onLogin()
    } else {
      setError('Wrong username or password!')
    }
  }*/}
  const handleLogin = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (res.ok) {

      onLogin()
    } else {
      setError(data.message)
    }
  } catch (err) {
    setError('Server se connect nahi ho raha!')
  }
}


const handleForgot = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    })
    const data = await res.json()
    if (res.ok) { setStep('otp'); setError('') }
    else setError(data.message)
  } catch (err) { setError('Server se connect nahi ho raha!') }
}

const handleVerifyOTP = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    })
    const data = await res.json()
    if (res.ok) { setStep('reset'); setError('') }
    else setError(data.message)
  } catch (_err) { setError('Server se connect nahi ho raha!') }
}
{/*requet handle kar raha login part  */}
const handleReset = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, newUsername, newPassword })
    })
    const data = await res.json()
    if (res.ok) { setStep('login'); setError('') }
    else setError(data.message)
  } catch (_err) { setError('Server se connect nahi ho raha!') }
}


  const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sv-root {
    min-height: 100vh;
    background: #040812;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    overflow: hidden;
    position: relative;
  }

  /* Animated grid background */
  .sv-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,180,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,180,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    animation: gridShift 20s linear infinite;
  }

  @keyframes gridShift {
    0% { background-position: 0 0; }
    100% { background-position: 40px 40px; }
  }

  /* Glow orbs */
  .sv-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    pointer-events: none;
  }
  .sv-orb-1 {
    width: 400px; height: 400px;
    background: #00ffb4;
    top: -100px; left: -100px;
    animation: orbFloat 8s ease-in-out infinite;
  }
  .sv-orb-2 {
    width: 300px; height: 300px;
    background: #0066ff;
    bottom: -80px; right: -80px;
    animation: orbFloat 10s ease-in-out infinite reverse;
  }

  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, 20px); }
  }

  /* Card */
  .sv-card {
    position: relative;
    width: 420px;
    background: rgba(8, 16, 32, 0.85);
    border: 1px solid rgba(0,255,180,0.15);
    border-radius: 2px;
    padding: 48px 44px;
    backdrop-filter: blur(20px);
    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    box-shadow:
      0 0 0 1px rgba(0,255,180,0.05),
      0 32px 64px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.05);
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Corner accents */
  .sv-card::before, .sv-card::after {
    content: '';
    position: absolute;
    width: 16px; height: 16px;
    border-color: #00ffb4;
    border-style: solid;
    opacity: 0.6;
  }
  .sv-card::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
  .sv-card::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

  /* Header */
  .sv-icon-wrap {
    width: 52px; height: 52px;
    border: 1px solid rgba(0,255,180,0.3);
    border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 28px;
    background: rgba(0,255,180,0.05);
  }

  .sv-icon {
    width: 26px; height: 26px;
    stroke: #00ffb4;
    fill: none;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .sv-label-tag {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: #00ffb4;
    text-transform: uppercase;
    margin-bottom: 8px;
    opacity: 0.7;
  }

  .sv-title {
    font-size: 26px;
    font-weight: 650;
    color: #e8f0fe;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 6px;
  }

  .sv-subtitle {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    font-weight: 400;
    margin-bottom: 36px;
    font-family: 'Space Mono', monospace;
  }

  /* Divider line */
  .sv-divider {
    height: 1px;
    background: linear-gradient(90deg, rgba(0,255,180,0.2), transparent);
    margin-bottom: 32px;
  }

  /* Form fields */
  .sv-field {
    margin-bottom: 20px;
  }

  .sv-field-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-bottom: 8px;
    display: block;
  }

  .sv-input-wrap {
    position: relative;
  }

  .sv-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 2px;
    padding: 13px 16px 13px 42px;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    color: #e8f0fe;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .sv-input::placeholder { color: rgba(255,255,255,0.18); }

  .sv-input:focus {
    border-color: rgba(0,255,180,0.4);
    background: rgba(0,255,180,0.03);
    box-shadow: 0 0 0 3px rgba(0,255,180,0.07);
  }

  .sv-input-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px; height: 16px;
    stroke: rgba(255,255,255,0.25);
    fill: none;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    pointer-events: none;
    transition: stroke 0.2s;
  }

  .sv-input:focus ~ .sv-input-icon { stroke: rgba(0,255,180,0.5); }

  .sv-eye-btn {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    color: rgba(255,255,255,0.25);
    line-height: 0;
    transition: color 0.2s;
  }
  .sv-eye-btn:hover { color: rgba(0,255,180,0.6); }
  .sv-eye-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

  /* Remember + Forgot row */
  .sv-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .sv-check-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    user-select: none;
  }

  .sv-checkbox {
    width: 14px; height: 14px;
    border: 1px solid rgba(0,255,180,0.3);
    border-radius: 2px;
    appearance: none;
    background: transparent;
    cursor: pointer;
    position: relative;
    transition: background 0.15s, border-color 0.15s;
  }
  .sv-checkbox:checked {
    background: rgba(0,255,180,0.2);
    border-color: #00ffb4;
  }
  .sv-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 3px; top: 1px;
    width: 5px; height: 8px;
    border: 1.5px solid #00ffb4;
    border-top: none; border-left: none;
    transform: rotate(45deg);
  }

  .sv-forgot {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: rgba(0,255,180,0.5);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }
  .sv-forgot:hover { color: #00ffb4; }

  /* Submit button */
  .sv-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, rgba(0,255,180,0.15) 0%, rgba(0,100,255,0.1) 100%);
    border: 1px solid rgba(0,255,180,0.35);
    border-radius: 2px;
    color: #00ffb4;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    position: relative;
    overflow: hidden;
  }

  .sv-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,255,180,0.08), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .sv-btn:hover::before { opacity: 1; }
  .sv-btn:hover { box-shadow: 0 0 24px rgba(0,255,180,0.15); }
  .sv-btn:active { transform: scale(0.99); }

  .sv-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .sv-btn-arrow {
    width: 14px; height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.2s;
  }
  .sv-btn:hover .sv-btn-arrow { transform: translateX(3px); }

  /* Spinner */
  .sv-spinner {
    width: 16px; height: 16px;
    border: 1.5px solid rgba(0,255,180,0.2);
    border-top-color: #00ffb4;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Error */
  .sv-error {
    background: rgba(255,60,60,0.08);
    border: 1px solid rgba(255,60,60,0.25);
    border-radius: 2px;
    padding: 10px 14px;
    margin-bottom: 20px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: #ff7070;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

  /* Footer */
  .sv-footer {
    margin-top: 28px;
    text-align: center;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: rgba(255,255,255,0.2);
  }
  .sv-footer-link {
    color: rgba(0,255,180,0.5);
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    padding: 0;
    transition: color 0.2s;
  }
  .sv-footer-link:hover { color: #00ffb4; }

  /* Status bar */
  .sv-status {
    position: fixed;
    bottom: 26px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.1em;
    color: rgba(0,255,180,0.25);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sv-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #00ffb4;
    opacity: 0.4;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.7; }
  }
`;

return (
  <>
    <style>{styles}</style>
    <div className="sv-root">
      <div className="sv-grid" />
      <div className="sv-orb sv-orb-1" />
      <div className="sv-orb sv-orb-2" />

      <div className="sv-card">
        {step === 'login' && <>
          <div className="sv-label-tag">Mobile Store</div>
          <div className="sv-title">Welcome Back</div>
          <div className="sv-subtitle">Sign in to continue</div>
          <div className="sv-divider" />
          {error && <div className="sv-error">{error}</div>}
          <div className="sv-field">
            <label className="sv-field-label">Username</label>
            <input className="sv-input" type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="sv-field">
            <label className="sv-field-label">Password</label>
            <input className="sv-input" type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="sv-btn" onClick={handleLogin}>Login</button>
          <button className="sv-forgot" style={{marginTop:'16px', width:'100%', textAlign:'center'}} onClick={() => setStep('forgot')}>Forgot Password?</button>
        </>}

        {step === 'forgot' && <>
          <div className="sv-title">Reset Password</div>
        {/*  <div className="sv-subtitle">Enter your number</div> */}
          <div className="sv-divider" />
          {error && <div className="sv-error">{error}</div>}
          <div className="sv-field">
            <label className="sv-field-label">Phone Number</label>
            <input className="sv-input" type="email" placeholder="Enter phone number" onChange={(e) => setPhone(e.target.value)} />
          </div>
          <button className="sv-btn" onClick={handleForgot}>Send OTP</button>
          <button className="sv-forgot" style={{marginTop:'16px', width:'100%', textAlign:'center'}} onClick={() => setStep('login')}>Back to Login</button>
        </>}

        {step === 'otp' && <>
          <div className="sv-title">Enter OTP</div>
          <div className="sv-subtitle">Check your Phone</div>
          <div className="sv-divider" />
          {error && <div className="sv-error">{error}</div>}
          <div className="sv-field">
            <label className="sv-field-label">OTP</label>
            <input className="sv-input" type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
          </div>
          <button className="sv-btn" onClick={handleVerifyOTP}>Verify OTP</button>
        </>}

        {step === 'reset' && <>
          <div className="sv-title">New Credentials</div>
          <div className="sv-subtitle">Set new username & password</div>
          <div className="sv-divider" />
          {error && <div className="sv-error">{error}</div>}
          <div className="sv-field">
            <label className="sv-field-label">New Username</label>
            <input className="sv-input" type="text" placeholder="New username" onChange={(e) => setNewUsername(e.target.value)} />
          </div>
          <div className="sv-field">
            <label className="sv-field-label">New Password</label>
            <input className="sv-input" type="password" placeholder="New password" onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <button className="sv-btn" onClick={handleReset}>Reset & Login</button>
        </>}
      </div>

      <div className="sv-status">
        <div className="sv-status-dot" />
        StorageVault System
      </div>
    </div>
  </>
)
}

export default Login