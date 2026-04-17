import { useState } from 'react'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import { updateProfile } from '../services/api'
import toast from 'react-hot-toast'
import { MdEdit, MdSave, MdPerson, MdEmail, MdPhone, MdCalendarToday } from 'react-icons/md'

export default function ProfilePage() {
  const { user, loginUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', mobile: user?.mobile || '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await updateProfile(form)
      loginUser(res.data.user, localStorage.getItem('token'))
      toast.success('Profile updated!')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <Layout title="My Profile">
      <div className="fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Avatar Section */}
        <div className="card card-body" style={{ textAlign: 'center', marginBottom: 24, padding: '40px 32px' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--blue), var(--navy-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, fontWeight: 800, color: 'white',
            boxShadow: '0 8px 32px rgba(26,86,219,0.3)'
          }}>
            {initials}
          </div>
          <h2 style={{ fontSize: 24, color: 'var(--navy)', marginBottom: 4 }}>{user?.name}</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>{user?.email}</p>
          <div style={{ marginTop: 12 }}>
            <span className="badge badge-blue">Active Account</span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="card card-body" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, color: 'var(--navy)' }}>Account Information</h3>
            {!editing ? (
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                <MdEdit /> Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                  {saving ? <span className="spinner spinner-sm" /> : <MdSave />} Save
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdPerson style={{ color: 'var(--blue)', fontSize: 20 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Full Name</div>
                {editing ? (
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                ) : (
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{user?.name}</div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdEmail style={{ color: 'var(--green)', fontSize: 20 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Email Address</div>
                <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{user?.email}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Email cannot be changed</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdPhone style={{ color: 'var(--gold)', fontSize: 20 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Mobile Number</div>
                {editing ? (
                  <input className="form-input" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />
                ) : (
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{user?.mobile}</div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdCalendarToday style={{ color: '#9d174d', fontSize: 20 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Member Since</div>
                <div style={{ fontWeight: 600, color: 'var(--navy)' }}>
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="card card-body">
          <h3 style={{ fontSize: 18, color: 'var(--navy)', marginBottom: 16 }}>Security</h3>
          <div className="alert alert-info">
            🔒 Your account is secured with JWT authentication and bcrypt password hashing. All data is encrypted.
          </div>
        </div>
      </div>
    </Layout>
  )
}
