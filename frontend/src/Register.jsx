import { useState } from 'react'

function Register({ onSwitchToLogin }) {
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '', phone: '', role: 'staff'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async () => {
    setError('')
    setSuccess('')

    if (!form.email || !form.password || !form.phone) {
      setError('Sab fields fill karo!')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords match nahi kar rahe!')
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.email,
          password: form.password,
          phone: form.phone,
          role: form.role
        })
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess('Account ban gaya! Login karo...')
        setTimeout(() => onSwitchToLogin(), 1500)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Server se connect nahi ho raha!')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{background:'#f8f9fa'}}>

      <div className="card register-card shadow p-3 w-50" style={{maxWidth:'420px', borderRadius:'12px',
         background:'#fff' ,border:'none'}}>

        {/* Header */}
        <div className="text-center mb-1">
          {/*<div style={{fontSize:'32px'}}>📱</div>*/}
          <p style={{color:'#6c757d', fontSize:'20px', letterSpacing:'0.15em', marginBottom:'2px'}}>
            MOBILE STORE
          </p>
          <h3 style={{color:'#212529', fontWeight:800, marginBottom:'2px'}}>Create Account</h3>
        </div>

        <hr style={{borderColor:'#e9ecef', marginBottom:'24px'}} />

        {error && (
          <div className="alert alert-danger py-2 px-3" style={{fontSize:'12px', borderRadius:'8px'}}>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success py-2 px-3" style={{fontSize:'12px', borderRadius:'8px'}}>
            {success}
          </div>
        )}

        {/* Email */}
        <div className="mb-3">
          <label style={{fontSize:'12px', color:'#6c757d', fontWeight:600}} className="d-block mb-1">
            EMAIL
          </label>
          <input
            type="email"
            placeholder="Enter email"
            className="form-control"
            style={{borderRadius:'8px', fontSize:'14px', padding:'10px 14px'}}
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label style={{fontSize:'12px', color:'#6c757d', fontWeight:600}} className="d-block mb-1">
            PASSWORD
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className="form-control"
            style={{borderRadius:'8px', fontSize:'14px', padding:'10px 14px'}}
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label style={{fontSize:'12px', color:'#6c757d', fontWeight:600}} className="d-block mb-1">
            CONFIRM PASSWORD
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            className="form-control"
            style={{
              borderRadius:'8px', fontSize:'14px', padding:'10px 14px',
              borderColor: form.confirmPassword
                ? form.password === form.confirmPassword ? '#198754' : '#dc3545'
                : ''
            }}
            value={form.confirmPassword}
            onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
            required
          />
          {form.confirmPassword && (
            <small style={{color: form.password === form.confirmPassword ? '#198754' : '#dc3545'}}>
              {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Match nahi kar rahe'}
            </small>
          )}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label style={{fontSize:'12px', color:'#6c757d', fontWeight:600}} className="d-block mb-1">
            PHONE NUMBER
          </label>
          <input
            type="tel"
            placeholder="10 digit number"
            className="form-control"
            style={{borderRadius:'8px', fontSize:'14px', padding:'10px 14px'}}
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            required
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label style={{fontSize:'12px', color:'#6c757d', fontWeight:600}} className="d-block mb-1">
            ROLE
          </label>
          <select
            className="form-select"
            style={{borderRadius:'8px', fontSize:'14px', padding:'10px 14px'}}
            value={form.role}
            onChange={(e) => setForm({...form, role: e.target.value})}
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Button */}
        <button
          className="btn btn-dark w-100 py-2 mb-3"
          style={{borderRadius:'8px', fontWeight:700, fontSize:'14px'}}
          onClick={handleRegister}
        >
          Create Account
        </button>

        {/* Login link */}
        <p className="text-center mb-0" style={{fontSize:'13px', color:'#6c757d'}}>
          Already have account?{' '}
          <span
            onClick={onSwitchToLogin}
            style={{color:'#0d6efd', cursor:'pointer', fontWeight:600}}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  )
}

export default Register