import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { MdArrowForward } from 'react-icons/md'

const LOAN_TYPES = [
  {
    type: 'house',
    icon: '🏠',
    title: 'House Loan',
    subtitle: 'Home Purchase / Construction',
    desc: 'Finance your dream home with competitive interest rates. Predict your eligibility for home loans up to ₹5 Crore.',
    features: ['Property document upload', 'Up to 30-year tenure', 'Tax benefits available'],
    color: '#dbeafe',
    accent: '#1a56db',
    minAmount: '₹10 Lakh',
    maxAmount: '₹5 Crore'
  },
  {
    type: 'student',
    icon: '👨‍🎓',
    title: 'Student Loan',
    subtitle: 'Education Finance',
    desc: 'Fund your higher education in India or abroad. Check eligibility for undergraduate or postgraduate courses.',
    features: ['Admission proof required', 'Course fee coverage', 'Moratorium period'],
    color: '#d1fae5',
    accent: '#059669',
    minAmount: '₹50,000',
    maxAmount: '₹40 Lakh'
  },
  {
    type: 'personal',
    icon: '💼',
    title: 'Personal Loan',
    subtitle: 'Employment / Salaried',
    desc: 'Instant personal loans for salaried employees. No collateral required, fast disbursement.',
    features: ['No collateral needed', 'Minimal documentation', 'Quick approval'],
    color: '#fef3c7',
    accent: '#d97706',
    minAmount: '₹50,000',
    maxAmount: '₹25 Lakh'
  },
  {
    type: 'gold',
    icon: '🥇',
    title: 'Gold Loan',
    subtitle: 'Gold Collateral',
    desc: 'Pledge your gold ornaments or coins and get instant funds. Lowest interest rates in the market.',
    features: ['Gold valuation required', 'Lowest interest rate', 'Instant disbursement'],
    color: '#fce7f3',
    accent: '#9d174d',
    minAmount: '₹10,000',
    maxAmount: '₹1 Crore'
  }
]

export default function LoanCategoryPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const handleContinue = () => {
    if (selected) navigate(`/loan-form/${selected}`)
  }

  return (
    <Layout title="Select Loan Type">
      <div className="fade-in">
        <div style={{ marginBottom: 32, maxWidth: 560 }}>
          <h2 style={{ fontSize: 28, color: 'var(--navy)', marginBottom: 8 }}>
            What kind of loan are you looking for?
          </h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 15 }}>
            Select a loan category to check your eligibility using our AI-powered prediction engine.
          </p>
        </div>

        <div className="grid-2" style={{ marginBottom: 32 }}>
          {LOAN_TYPES.map(loan => (
            <div
              key={loan.type}
              className={`loan-card ${selected === loan.type ? 'selected' : ''}`}
              style={{ textAlign: 'left', cursor: 'pointer', padding: '28px' }}
              onClick={() => setSelected(loan.type)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 70, height: 70, borderRadius: 16, flexShrink: 0,
                  background: loan.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36
                }}>
                  {loan.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: 18, color: 'var(--navy)', marginBottom: 2 }}>{loan.title}</h3>
                      <div style={{ fontSize: 12, color: loan.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                        {loan.subtitle}
                      </div>
                    </div>
                    {selected === loan.type && (
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: 'white', fontSize: 13 }}>✓</span>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: 12 }}>{loan.desc}</p>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Min</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{loan.minAmount}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Max</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{loan.maxAmount}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {loan.features.map(f => (
                      <span key={f} style={{
                        fontSize: 11, padding: '3px 10px', borderRadius: 50,
                        background: loan.color, color: loan.accent, fontWeight: 600
                      }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Cancel</button>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleContinue}
            disabled={!selected}
          >
            Continue to Application <MdArrowForward />
          </button>
        </div>
      </div>
    </Layout>
  )
}
