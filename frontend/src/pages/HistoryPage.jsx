import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getLoanHistory } from '../services/api'
import { MdCheckCircle, MdCancel, MdPending, MdSearch, MdFilterList } from 'react-icons/md'

export default function HistoryPage() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    getLoanHistory()
      .then(res => setApplications(res.data.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = applications.filter(a => {
    const matchSearch = !search || (a.loan_type || '').toLowerCase().includes(search.toLowerCase())
      || String(a.id).includes(search)
    const matchFilter = filter === 'All' || a.status === filter
    return matchSearch && matchFilter
  })

  const statusIcon = (s) => {
    if (s === 'Eligible') return <MdCheckCircle style={{ color: 'var(--green)' }} />
    if (s === 'Not Eligible') return <MdCancel style={{ color: 'var(--red)' }} />
    return <MdPending style={{ color: 'var(--gold)' }} />
  }

  const statusBadge = (status) => {
    if (status === 'Eligible') return <span className="badge badge-green"><MdCheckCircle /> Eligible</span>
    if (status === 'Not Eligible') return <span className="badge badge-red"><MdCancel /> Not Eligible</span>
    return <span className="badge badge-gold"><MdPending /> Pending</span>
  }

  return (
    <Layout title="Loan History">
      <div className="fade-in">
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <MdSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)', fontSize: 20 }} />
            <input
              className="form-input"
              style={{ paddingLeft: 40 }}
              placeholder="Search by loan type or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['All', 'Eligible', 'Not Eligible', 'Pending'].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                style={{ border: '1px solid var(--gray-200)' }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total', val: applications.length, color: 'var(--blue)' },
            { label: 'Eligible', val: applications.filter(a => a.status === 'Eligible').length, color: 'var(--green)' },
            { label: 'Not Eligible', val: applications.filter(a => a.status === 'Not Eligible').length, color: 'var(--red)' },
            { label: 'Pending', val: applications.filter(a => a.status === 'Pending').length, color: 'var(--gold)' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ color: s.color }}>{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <div className="spinner" style={{ margin: '0 auto' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--gray-500)' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📂</div>
                <p style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 18, marginBottom: 8 }}>
                  {applications.length === 0 ? 'No applications yet' : 'No results found'}
                </p>
                <p style={{ fontSize: 14, marginBottom: 24 }}>
                  {applications.length === 0 ? 'Start your first loan eligibility check' : 'Try adjusting your search filters'}
                </p>
                {applications.length === 0 && (
                  <button className="btn btn-primary" onClick={() => navigate('/loan-category')}>
                    Apply Now
                  </button>
                )}
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Loan Type</th>
                    <th>Amount (₹)</th>
                    <th>Income (₹/mo)</th>
                    <th>Status</th>
                    <th>Probability</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 700, color: 'var(--blue)' }}>#{a.id}</td>
                      <td>{a.loan_type || 'Personal'}</td>
                      <td>₹{(a.loan_amount || 0).toLocaleString()}</td>
                      <td>₹{(a.applicant_income || 0).toLocaleString()}</td>
                      <td>{statusBadge(a.status)}</td>
                      <td>
                        {a.prediction_probability != null ? (
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 700 }}>
                              {(a.prediction_probability * 100).toFixed(1)}%
                            </span>
                            <div className="prob-meter" style={{ width: 80, marginTop: 4 }}>
                              <div className="prob-meter-fill" style={{
                                width: `${a.prediction_probability * 100}%`,
                                background: a.prediction_probability > 0.5 ? 'var(--green)' : 'var(--red)'
                              }} />
                            </div>
                          </div>
                        ) : '—'}
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                        {new Date(a.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm"
                          onClick={() => navigate(`/result/${a.id}`)}>
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
      </div>
    </Layout>
  )
}
