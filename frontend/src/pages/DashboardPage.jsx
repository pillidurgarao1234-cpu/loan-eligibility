import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import { getLoanHistory } from '../services/api'
import { MdTrendingUp, MdHistory, MdAttachMoney, MdCheckCircle, MdCancel, MdPending, MdArrowForward } from 'react-icons/md'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLoanHistory()
      .then(res => setHistory(res.data.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const eligible = history.filter(a => a.status === 'Eligible').length
  const notEligible = history.filter(a => a.status === 'Not Eligible').length
  const pending = history.filter(a => a.status === 'Pending').length
  const latest = history.slice(0, 5)

  const getHour = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const statusBadge = (status) => {
    if (status === 'Eligible') return <span className="badge badge-green"><MdCheckCircle /> Eligible</span>
    if (status === 'Not Eligible') return <span className="badge badge-red"><MdCancel /> Not Eligible</span>
    return <span className="badge badge-gold"><MdPending /> Pending</span>
  }

  return (
    <Layout title="Dashboard">
      <div className="fade-in">
        {/* Welcome */}
        <div style={{
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
          borderRadius: 'var(--radius-lg)', padding: '32px', marginBottom: 28, position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: 32, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 80, opacity: 0.08 }}>
            🏦
          </div>
          <div style={{ position: 'relative' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 6 }}>
              {getHour()},
            </p>
            <h2 style={{ color: 'white', fontSize: 28, marginBottom: 10, fontFamily: 'Playfair Display' }}>
              {user?.name} 👋
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, maxWidth: 480, marginBottom: 20 }}>
              Check your loan eligibility with our AI-powered prediction engine. Fast, accurate, and personalized.
            </p>
            <button className="btn btn-gold" onClick={() => navigate('/loan-category')}>
              Apply for Loan <MdArrowForward />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}><MdTrendingUp style={{ color: 'var(--blue)', fontSize: 24 }} /></div>
            <div className="stat-value">{history.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--green-light)' }}><MdCheckCircle style={{ color: 'var(--green)', fontSize: 24 }} /></div>
            <div className="stat-value">{eligible}</div>
            <div className="stat-label">Eligible</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--red-light)' }}><MdCancel style={{ color: 'var(--red)', fontSize: 24 }} /></div>
            <div className="stat-value">{notEligible}</div>
            <div className="stat-label">Not Eligible</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}><MdAttachMoney style={{ color: 'var(--gold)', fontSize: 24 }} /></div>
            <div className="stat-value">{history.length > 0 ? Math.round(history.reduce((s, a) => s + (a.loan_amount || 0), 0) / history.length).toLocaleString() : 0}</div>
            <div className="stat-label">Avg Loan Amount (₹)</div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 18, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <MdHistory style={{ color: 'var(--blue)' }} /> Recent Applications
            </h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/history')}>View All</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : latest.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--gray-500)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <p style={{ fontWeight: 600, marginBottom: 6, color: 'var(--navy)' }}>No applications yet</p>
                <p style={{ fontSize: 14, marginBottom: 20 }}>Start your first loan eligibility check</p>
                <button className="btn btn-primary" onClick={() => navigate('/loan-category')}>Apply Now</button>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Loan Type</th>
                    <th>Amount (₹)</th>
                    <th>Status</th>
                    <th>Probability</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {latest.map(a => (
                    <tr key={a.id}>
                      <td><strong>{a.loan_type || 'Personal'}</strong></td>
                      <td>₹{(a.loan_amount || 0).toLocaleString()}</td>
                      <td>{statusBadge(a.status)}</td>
                      <td>
                        {a.prediction_probability != null ? (
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                              {(a.prediction_probability * 100).toFixed(1)}%
                            </div>
                            <div className="prob-meter">
                              <div className="prob-meter-fill" style={{
                                width: `${a.prediction_probability * 100}%`,
                                background: a.prediction_probability > 0.5 ? 'var(--green)' : 'var(--red)'
                              }} />
                            </div>
                          </div>
                        ) : '—'}
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                        {new Date(a.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/result/${a.id}`)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid-3">
          {[
            { icon: '🏠', title: 'House Loan', desc: 'Check home loan eligibility', type: 'house' },
            { icon: '💼', title: 'Personal Loan', desc: 'Quick personal loan check', type: 'personal' },
            { icon: '👨‍🎓', title: 'Student Loan', desc: 'Education finance prediction', type: 'student' },
          ].map(l => (
            <div key={l.type} className="card card-body"
              style={{ cursor: 'pointer', transition: 'var(--transition)' }}
              onClick={() => navigate(`/loan-form/${l.type}`)}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{l.icon}</div>
              <h3 style={{ fontSize: 16, color: 'var(--navy)', marginBottom: 6 }}>{l.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>{l.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
