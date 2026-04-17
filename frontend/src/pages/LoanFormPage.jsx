import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { applyLoan, predictLoan } from '../services/api'
import toast from 'react-hot-toast'
import {
  MdPerson,
  MdAttachMoney,
  MdHome,
  MdArrowForward,
  MdArrowBack,
  MdCheckCircle
} from 'react-icons/md'

const LOAN_LABELS = {
  house: 'House Loan',
  student: 'Student Loan',
  personal: 'Personal Loan',
  gold: 'Gold Loan'
}

const STEPS = [
  { id: 1, title: 'Personal', icon: <MdPerson /> },
  { id: 2, title: 'Financial', icon: <MdAttachMoney /> },
  { id: 3, title: 'Loan Details', icon: <MdHome /> }
]

const INIT = {
  full_name: '',
  age: '',
  gender: 'Male',
  marital_status: 'No',
  education: 'Graduate',
  dependents: '0',
  employment_type: 'Salaried',
  address: '',
  pan_number: '',
  aadhaar_number: '',
  applicant_income: '',
  coapplicant_income: '0',
  monthly_salary: '',
  existing_emi: '0',
  credit_score: '',
  bank_balance: '',
  loan_amount: '',
  loan_amount_term: '360',
  cibil_score: '',
  existing_debts: '0',
  credit_history: '1',
  property_area: 'Urban',
  self_employed: 'No',
  purpose: ''
}

function Field({ label, children, err }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
      {err && <span className="form-error">{err}</span>}
    </div>
  )
}

export default function LoanFormPage() {
  const { type } = useParams()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const validateStep = useCallback(() => {
    const e = {}

    if (step === 1) {
      if (!form.full_name.trim()) e.full_name = 'Required'
      if (!form.age || Number(form.age) < 18 || Number(form.age) > 80) {
        e.age = 'Age must be 18-80'
      }
      if (form.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan_number)) {
        e.pan_number = 'Invalid PAN format (e.g. ABCDE1234F)'
      }
      if (form.aadhaar_number && !/^\d{12}$/.test(form.aadhaar_number)) {
        e.aadhaar_number = 'Aadhaar must be 12 digits'
      }
    }

    if (step === 2) {
      if (!form.applicant_income || Number(form.applicant_income) <= 0) {
        e.applicant_income = 'Required'
      }
      if (!form.loan_amount || Number(form.loan_amount) <= 0) {
        e.loan_amount = 'Required'
      }
      if (!form.credit_score || Number(form.credit_score) < 300 || Number(form.credit_score) > 900) {
        e.credit_score = '300-900'
      }
      if (!form.cibil_score || Number(form.cibil_score) < 300 || Number(form.cibil_score) > 900) {
        e.cibil_score = '300-900'
      }
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }, [form, step])

  const nextStep = () => {
    if (validateStep()) setStep((s) => s + 1)
  }

  const prevStep = () => {
    setStep((s) => s - 1)
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()

    if (!validateStep()) return

    setLoading(true)

    try {
      const payload = {
        ...form,
        loan_type: LOAN_LABELS[type] || type
      }

      const applyRes = await applyLoan(payload)
      const appId = applyRes.data.application_id

      const predictRes = await predictLoan({
        ...payload,
        application_id: appId
      })

      toast.success('Application submitted! Navigating to results...')

      navigate(`/upload-documents/${appId}`, {
        state: {
          predictionResult: predictRes.data,
          applicationData: payload
        }
      })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed.')
    } finally {
      setLoading(false)
    }
  }

  const progress = useMemo(() => {
    return ((step - 1) / (STEPS.length - 1)) * 100
  }, [step])

  const inp = (key, type = 'text', placeholder = '') => (
    <input
      name={key}
      className={`form-input ${errors[key] ? 'error' : ''}`}
      type={type}
      placeholder={placeholder}
      value={form[key]}
      onChange={handleChange}
      autoComplete="off"
    />
  )

  const sel = (key, options) => (
    <select
      name={key}
      className={`form-select ${errors[key] ? 'error' : ''}`}
      value={form[key]}
      onChange={handleChange}
    >
      {options.map((o) =>
        typeof o === 'string' ? (
          <option key={o} value={o}>
            {o}
          </option>
        ) : (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        )
      )}
    </select>
  )

  return (
    <Layout title={`${LOAN_LABELS[type] || 'Loan'} Application`}>
      <div className="fade-in" style={{ maxWidth: 780, margin: '0 auto' }}>
        <div className="card" style={{ padding: '24px 28px', marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                color: 'var(--gray-500)',
                marginBottom: 8
              }}
            >
              <span>Step {step} of {STEPS.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>

            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.max(progress, 5)}%` }}
              />
            </div>
          </div>

          <div className="steps">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`step-item ${step === s.id ? 'active' : step > s.id ? 'done' : ''}`}
              >
                <div className="step-circle">
                  {step > s.id ? <MdCheckCircle /> : s.id}
                </div>
                <span className="step-label">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-body">
              {step === 1 && (
                <div className="slide-in">
                  <div className="section-title">
                    <MdPerson /> Personal Details
                  </div>

                  <div className="grid-2" style={{ gap: 18 }}>
                    <Field label="Full Name *" err={errors.full_name}>
                      {inp('full_name', 'text', 'Your full legal name')}
                    </Field>

                    <Field label="Age *" err={errors.age}>
                      {inp('age', 'number', '18-80')}
                    </Field>

                    <Field label="Gender">
                      {sel('gender', ['Male', 'Female', 'Other'])}
                    </Field>

                    <Field label="Marital Status">
                      {sel('marital_status', [
                        { v: 'Yes', l: 'Married' },
                        { v: 'No', l: 'Unmarried' }
                      ])}
                    </Field>

                    <Field label="Education">
                      {sel('education', ['Graduate', 'Not Graduate'])}
                    </Field>

                    <Field label="Dependents">
                      {sel('dependents', ['0', '1', '2', '3+'])}
                    </Field>

                    <Field label="Employment Type">
                      {sel('employment_type', [
                        'Salaried',
                        'Self-Employed',
                        'Business',
                        'Freelancer',
                        'Unemployed'
                      ])}
                    </Field>

                    <Field label="Self Employed">
                      {sel('self_employed', [
                        { v: 'No', l: 'No' },
                        { v: 'Yes', l: 'Yes' }
                      ])}
                    </Field>

                    <Field label="PAN Number" err={errors.pan_number}>
                      {inp('pan_number', 'text', 'ABCDE1234F')}
                    </Field>

                    <Field label="Aadhaar Number" err={errors.aadhaar_number}>
                      {inp('aadhaar_number', 'text', '12-digit number')}
                    </Field>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <Field label="Address">
                        <textarea
                          name="address"
                          className="form-input"
                          rows={3}
                          placeholder="Full residential address"
                          value={form.address}
                          onChange={handleChange}
                          style={{ resize: 'vertical' }}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="slide-in">
                  <div className="section-title">
                    <MdAttachMoney /> Financial Details
                  </div>

                  <div className="grid-2" style={{ gap: 18 }}>
                    <Field label="Applicant Income (₹/month) *" err={errors.applicant_income}>
                      {inp('applicant_income', 'number', 'Monthly income')}
                    </Field>

                    <Field label="Co-Applicant Income (₹/month)">
                      {inp('coapplicant_income', 'number', '0 if none')}
                    </Field>

                    <Field label="Monthly Salary (₹)">
                      {inp('monthly_salary', 'number', 'Net monthly salary')}
                    </Field>

                    <Field label="Existing EMI (₹/month)">
                      {inp('existing_emi', 'number', '0 if none')}
                    </Field>

                    <Field label="Credit Score (300-900) *" err={errors.credit_score}>
                      {inp('credit_score', 'number', '700')}
                    </Field>

                    <Field label="CIBIL Score (300-900) *" err={errors.cibil_score}>
                      {inp('cibil_score', 'number', '750')}
                    </Field>

                    <Field label="Bank Balance (₹)">
                      {inp('bank_balance', 'number', 'Current bank balance')}
                    </Field>

                    <Field label="Existing Debts (₹)">
                      {inp('existing_debts', 'number', '0 if none')}
                    </Field>

                    <Field label="Loan Amount (₹) *" err={errors.loan_amount}>
                      {inp('loan_amount', 'number', 'Amount in thousands')}
                    </Field>

                    <Field label="Loan Amount Term (months)">
                      {sel('loan_amount_term', [
                        { v: '60', l: '60 months (5 yr)' },
                        { v: '120', l: '120 months (10 yr)' },
                        { v: '180', l: '180 months (15 yr)' },
                        { v: '240', l: '240 months (20 yr)' },
                        { v: '300', l: '300 months (25 yr)' },
                        { v: '360', l: '360 months (30 yr)' }
                      ])}
                    </Field>

                    <Field label="Credit History">
                      {sel('credit_history', [
                        { v: '1', l: 'Good (1)' },
                        { v: '0', l: 'Bad (0)' }
                      ])}
                    </Field>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="slide-in">
                  <div className="section-title">
                    <MdHome /> Loan & Property Details
                  </div>

                  <div className="grid-2" style={{ gap: 18 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Field label="Purpose of Loan">
                        <textarea
                          name="purpose"
                          className="form-input"
                          rows={2}
                          placeholder="Why do you need this loan?"
                          value={form.purpose}
                          onChange={handleChange}
                          style={{ resize: 'vertical' }}
                        />
                      </Field>
                    </div>

                    <Field label="Property Area">
                      {sel('property_area', ['Urban', 'Semiurban', 'Rural'])}
                    </Field>
                  </div>

                  <div
                    style={{
                      marginTop: 28,
                      padding: 20,
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--gray-200)'
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: 'var(--navy)',
                        marginBottom: 14,
                        fontSize: 15
                      }}
                    >
                      Application Summary
                    </div>

                    <div className="grid-2" style={{ gap: 10 }}>
                      {[
                        ['Name', form.full_name],
                        ['Loan Type', LOAN_LABELS[type] || type],
                        ['Income', `₹${Number(form.applicant_income || 0).toLocaleString()}/mo`],
                        ['Loan Amount', `₹${Number(form.loan_amount || 0).toLocaleString()}`],
                        ['CIBIL Score', form.cibil_score],
                        ['Credit History', form.credit_history === '1' ? 'Good' : 'Bad']
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 13
                          }}
                        >
                          <span style={{ color: 'var(--gray-500)' }}>{k}</span>
                          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>
                            {v || '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                padding: '20px 28px',
                borderTop: '1px solid var(--gray-100)',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                onClick={step === 1 ? () => navigate('/loan-category') : prevStep}
              >
                <MdArrowBack /> {step === 1 ? 'Change Category' : 'Back'}
              </button>

              {step < STEPS.length ? (
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next Step <MdArrowForward />
                </button>
              ) : (
                <button type="submit" className="btn btn-gold btn-lg" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner spinner-sm" /> Submitting...
                    </>
                  ) : (
                    'Submit & Get Prediction →'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}