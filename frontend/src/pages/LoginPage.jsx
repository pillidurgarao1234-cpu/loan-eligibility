import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import { login } from '../services/api'
import toast from 'react-hot-toast'
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdLogin } from 'react-icons/md'

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginUser } = useAuth()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.identifier.trim()) e.identifier = 'Email or mobile is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await login({ identifier: form.identifier, password: form.password })
      loginUser(res.data.user, res.data.token)
      toast.success(`Welcome back, ${res.data.user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Loan<span>Wise</span> AI</h1>
          <p>Sign in to your account</p>
        </div>

        {errors.general && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Email or Mobile</label>
              <div className="input-wrapper">
                <MdEmail className="input-icon" />
                <input
                  className={`form-input ${errors.identifier ? 'error' : ''}`}
                  type="text"
                  placeholder="Enter email or mobile number"
                  value={form.identifier}
                  onChange={set('identifier')}
                  autoComplete="username"
                />
              </div>
              {errors.identifier && <span className="form-error">{errors.identifier}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <MdLock className="input-icon" />
                <input
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="current-password"
                />
                <button type="button" className="input-action" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
              {loading ? <><span className="spinner spinner-sm" /> Signing in...</> : <><MdLogin /> Sign In</>}
            </button>
          </div>
        </form>

        <div className="divider auth-divider">or</div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--gray-500)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one free</Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--gray-500)' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
