import { useState } from 'react'

function Login({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState('login')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('role', data.role)
        localStorage.setItem('username', data.username)
        onLogin(data.role)
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
    } catch (err) { setError('Server se connect nahi ho raha!') }
  }

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
    } catch (err) { setError('Server se connect nahi ho raha!') }
  }

  const inputStyle = {
    borderRadius: '8px',
    fontSize: '14px',
    padding: '10px 14px',
    border: '1px solid #dee2e6',
    width: '100%',
    outline: 'none',
    background: '#fff',
    color: '#212529'
  }

  const labelStyle = {
    fontSize: '12px',
    color: '#6c757d',
    fontWeight: 600,
    display: 'block',
    marginBottom: '6px'
  }

  const btnStyle = {
    width: '100%',
    padding: '11px',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '14px',
    background: '#212529',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  }

  const linkStyle = {
    color: '#0d6efd',
    cursor: 'pointer',
    fontWeight: 600,
    background: 'none',
    border: 'none',
    fontSize: '13px',
    padding: 0
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>

        {/* ── LOGIN ── */}
        {step === 'login' && (
          <>
            <div style={{textAlign:'center', marginBottom:'28px'}}>
              <div style={{fontSize:'32px'}}>📱</div>
              <p style={{color:'#6c757d', fontSize:'11px', letterSpacing:'0.15em', margin:'4px 0'}}>
              MOBILE STORE
              </p>
              <h3 style={{color:'#212529', fontWeight:800, margin:'4px 0'}}>Welcome Back</h3>
              <p style={{color:'#adb5bd', fontSize:'13px', margin:0}}>Sign in to continue</p>
            </div>

            <hr style={{borderColor:'#e9ecef', marginBottom:'24px'}} />

            {error && (
              <div style={{
                background:'#fff5f5', border:'1px solid #fecaca',
                borderRadius:'8px', padding:'10px 14px',
                color:'#dc2626', fontSize:'12px', marginBottom:'16px'
              }}>
                {error}
              </div>
            )}

            <div style={{marginBottom:'16px'}}>
              <label style={labelStyle}>USERNAME</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div style={{marginBottom:'24px'}}>
              <label style={labelStyle}>PASSWORD</label>
              <input
                style={inputStyle}
                type="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button style={btnStyle} onClick={handleLogin}>
              Login
            </button>

            <div style={{textAlign:'center', marginTop:'16px'}}>
              <button style={linkStyle} onClick={() => setStep('forgot')}>
                Forgot Password?
              </button>
            </div>

            <div style={{textAlign:'center', marginTop:'10px'}}>
              <span style={{color:'#6c757d', fontSize:'13px'}}>New here? </span>
              <button style={linkStyle} onClick={onSwitchToRegister}>
                Register
              </button>
            </div>
          </>
        )}

        {/* ── FORGOT ── */}
        {step === 'forgot' && (
          <>
            <div style={{textAlign:'center', marginBottom:'28px'}}>
              <div style={{fontSize:'32px'}}>🔐</div>
              <h3 style={{color:'#212529', fontWeight:800, margin:'8px 0 4px'}}>Reset Password</h3>
              <p style={{color:'#adb5bd', fontSize:'13px', margin:0}}>OTP phone pe aayega</p>
            </div>

            <hr style={{borderColor:'#e9ecef', marginBottom:'24px'}} />

            {error && (
              <div style={{
                background:'#fff5f5', border:'1px solid #fecaca',
                borderRadius:'8px', padding:'10px 14px',
                color:'#dc2626', fontSize:'12px', marginBottom:'16px'
              }}>
                {error}
              </div>
            )}

            <div style={{marginBottom:'24px'}}>
              <label style={labelStyle}>PHONE NUMBER</label>
              <input
                style={inputStyle}
                type="tel"
                placeholder="Enter phone number"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button style={btnStyle} onClick={handleForgot}>
              Send OTP
            </button>

            <div style={{textAlign:'center', marginTop:'16px'}}>
              <button style={linkStyle} onClick={() => setStep('login')}>
                ← Back to Login
              </button>
            </div>
          </>
        )}

        {/* ── OTP ── */}
        {step === 'otp' && (
          <>
            <div style={{textAlign:'center', marginBottom:'28px'}}>
              <div style={{fontSize:'32px'}}>📲</div>
              <h3 style={{color:'#212529', fontWeight:800, margin:'8px 0 4px'}}>Enter OTP</h3>
              <p style={{color:'#adb5bd', fontSize:'13px', margin:0}}>Check your phone</p>
            </div>

            <hr style={{borderColor:'#e9ecef', marginBottom:'24px'}} />
            {error && (
              <div style={{
                background:'#fff5f5', border:'1px solid #fecaca',
                borderRadius:'8px', padding:'10px 14px',
                color:'#dc2626', fontSize:'12px', marginBottom:'16px'
              }}>
                {error}
              </div>
            )}

            <div style={{marginBottom:'24px'}}>
              <label style={labelStyle}>OTP</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button style={btnStyle} onClick={handleVerifyOTP}>
              Verify OTP
            </button>
          </>
        )}

        {/* ── RESET ── */}
        {step === 'reset' && (
          <>
            <div style={{textAlign:'center', marginBottom:'28px'}}>
              <div style={{fontSize:'32px'}}>✏️</div>
              <h3 style={{color:'#212529', fontWeight:800, margin:'8px 0 4px'}}>New Credentials</h3>
              <p style={{color:'#adb5bd', fontSize:'13px', margin:0}}>Set new username & password</p>
            </div>

            <hr style={{borderColor:'#e9ecef', marginBottom:'24px'}} />

            {error && (
              <div style={{
                background:'#fff5f5', border:'1px solid #fecaca',
                borderRadius:'8px', padding:'10px 14px',
                color:'#dc2626', fontSize:'12px', marginBottom:'16px'
              }}>
                {error}
              </div>
            )}

            <div style={{marginBottom:'16px'}}>
              <label style={labelStyle}>NEW USERNAME</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="New username"
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>

            <div style={{marginBottom:'24px'}}>
              <label style={labelStyle}>NEW PASSWORD</label>
              <input
                style={inputStyle}
                type="password"
                placeholder="New password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button style={btnStyle} onClick={handleReset}>
              Reset & Login
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default Login