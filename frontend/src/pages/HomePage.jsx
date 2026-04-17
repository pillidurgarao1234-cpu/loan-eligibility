import { useNavigate } from 'react-router-dom'
import { MdArrowForward, MdCheckCircle, MdStar, MdSpeed, MdSecurity, MdBarChart } from 'react-icons/md'

const features = [
  { icon: <MdSpeed />, title: 'Instant AI Prediction', desc: 'Get loan eligibility results in seconds using our trained ML model.' },
  { icon: <MdSecurity />, title: 'Bank-Grade Security', desc: 'Your data is encrypted and protected with JWT authentication.' },
  { icon: <MdBarChart />, title: 'Smart Suggestions', desc: 'Receive personalized tips to improve your loan eligibility.' },
]

const loanTypes = [
  { icon: '🏠', name: 'Home Loan', rate: 'From 8.5% p.a.' },
  { icon: '👨‍🎓', name: 'Student Loan', rate: 'From 9.5% p.a.' },
  { icon: '💼', name: 'Personal Loan', rate: 'From 10.5% p.a.' },
  { icon: '🥇', name: 'Gold Loan', rate: 'From 7.5% p.a.' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ fontFamily: 'Playfair Display', fontSize: 22, color: 'white', fontWeight: 700 }}>
          Loan<span style={{ color: '#f59e0b' }}>Wise</span> AI
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-gold btn-sm" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" style={{ paddingTop: 80 }}>
        <div className="container hero-content" style={{ padding: '80px 40px' }}>
          <div style={{ maxWidth: 640 }}>
            <div className="badge badge-gold" style={{ marginBottom: 20, display: 'inline-flex' }}>
              <MdStar /> AI-Powered • Instant Results
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 62px)', color: 'white', marginBottom: 20, lineHeight: 1.15 }}>
              Know Your Loan<br />
              <span style={{ color: '#f59e0b' }}>Eligibility</span> in Seconds
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', marginBottom: 36, lineHeight: 1.7, maxWidth: 520 }}>
              Upload your documents, fill your details, and let our machine learning model instantly predict whether you qualify for a loan — with personalized improvement tips.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn btn-gold btn-lg" onClick={() => navigate('/register')}>
                Check Eligibility Free <MdArrowForward />
              </button>
              <button className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }} onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 36, flexWrap: 'wrap' }}>
              {['100% Free', 'Instant Results', 'No Hidden Fees'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                  <MdCheckCircle style={{ color: '#10b981' }} /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOAN TYPES */}
      <section style={{ padding: '80px 40px', background: 'white' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <div className="badge badge-blue" style={{ marginBottom: 12, display: 'inline-flex' }}>Loan Products</div>
            <h2 style={{ fontSize: 36, color: 'var(--navy)' }}>Choose Your Loan Category</h2>
            <p style={{ color: 'var(--gray-500)', marginTop: 10, fontSize: 16 }}>Tailored predictions for every financial need</p>
          </div>
          <div className="grid-4">
            {loanTypes.map(l => (
              <div key={l.name} className="loan-card" onClick={() => navigate('/register')}>
                <div className="loan-card-icon" style={{ background: 'var(--gray-100)' }}>
                  <span style={{ fontSize: 40 }}>{l.icon}</span>
                </div>
                <h3>{l.name}</h3>
                <p>{l.rate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 40px', background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, color: 'var(--navy)' }}>Why Choose LoanWise AI?</h2>
          </div>
          <div className="grid-3">
            {features.map(f => (
              <div key={f.title} className="card card-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, color: 'var(--blue)', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 20, marginBottom: 10, color: 'var(--navy)' }}>{f.title}</h3>
                <p style={{ color: 'var(--gray-500)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 40px', background: 'white' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, color: 'var(--navy)' }}>How It Works</h2>
          </div>
          <div className="grid-4" style={{ textAlign: 'center' }}>
            {[
              { step: '01', title: 'Register', desc: 'Create a free account in seconds' },
              { step: '02', title: 'Fill Details', desc: 'Enter your personal & financial info' },
              { step: '03', title: 'Upload Docs', desc: 'Upload PAN, Aadhaar & salary proof' },
              { step: '04', title: 'Get Result', desc: 'AI predicts your eligibility instantly' },
            ].map(s => (
              <div key={s.step}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--blue), var(--navy-light))',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 800, margin: '0 auto 16px', fontFamily: 'Playfair Display'
                }}>{s.step}</div>
                <h3 style={{ fontSize: 18, color: 'var(--navy)', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 40px',
        background: 'linear-gradient(135deg, var(--navy) 0%, #0f2d5a 100%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: 36, color: 'white', marginBottom: 16 }}>Ready to Check Your Eligibility?</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: 32 }}>
            Join thousands of applicants who got instant loan predictions.
          </p>
          <button className="btn btn-gold btn-lg" onClick={() => navigate('/register')}>
            Start Free Now <MdArrowForward />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--gray-900)', padding: '32px 40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
        © 2024 LoanWise AI — Loan Eligibility Prediction Platform. All rights reserved.
      </footer>
    </div>
  )
}
