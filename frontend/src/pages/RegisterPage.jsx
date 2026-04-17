import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import { register } from '../services/api'
import toast from 'react-hot-toast'
import { MdPerson, MdEmail, MdPhone, MdLock, MdVisibility, MdVisibilityOff, MdPersonAdd } from 'react-icons/md'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { loginUser } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm_password: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(form.email)) e.email = 'Invalid email address'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Invalid mobile (10 digits, start 6-9)'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await register(form)
      loginUser(res.data.user, res.data.token)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed.'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const fields = [
    { key: 'name', label: 'Full Name', icon: <MdPerson />, type: 'text', placeholder: 'Enter your full name' },
    { key: 'email', label: 'Email Address', icon: <MdEmail />, type: 'email', placeholder: 'Enter your email' },
    { key: 'mobile', label: 'Mobile Number', icon: <MdPhone />, type: 'tel', placeholder: '10-digit mobile number' },
  ]

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">
          <h1>Loan<span>Wise</span> AI</h1>
          <p>Create your free account</p>
        </div>

        {errors.general && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(f => (
              <div className="form-group" key={f.key}>
                <label className="form-label">{f.label}</label>
                <div className="input-wrapper">
                  <span className="input-icon">{f.icon}</span>
                  <input
                    className={`form-input ${errors[f.key] ? 'error' : ''}`}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={set(f.key)}
                  />
                </div>
                {errors[f.key] && <span className="form-error">{errors[f.key]}</span>}
              </div>
            ))}

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <MdLock className="input-icon" />
                <input
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={set('password')}
                />
                <button type="button" className="input-action" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <MdLock className="input-icon" />
                <input
                  className={`form-input ${errors.confirm_password ? 'error' : ''}`}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirm_password}
                  onChange={set('confirm_password')}
                />
                <button type="button" className="input-action" onClick={() => setShowConfirm(s => !s)}>
                  {showConfirm ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
              {errors.confirm_password && <span className="form-error">{errors.confirm_password}</span>}
            </div>

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
              {loading ? <><span className="spinner spinner-sm" /> Creating account...</> : <><MdPersonAdd /> Create Account</>}
            </button>
          </div>
        </form>

        <div className="divider auth-divider">or</div>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--gray-500)' }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--gray-500)' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
