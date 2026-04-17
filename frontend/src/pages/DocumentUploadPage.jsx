import { useState, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import { uploadDocuments } from '../services/api'
import toast from 'react-hot-toast'
import { MdUploadFile, MdCheckCircle, MdClose, MdArrowForward, MdSkipNext } from 'react-icons/md'

const DOC_TYPES = [
  { key: 'pan_file', label: 'PAN Card', icon: '🪪', required: true, desc: 'Government issued PAN card' },
  { key: 'aadhaar_file', label: 'Aadhaar Card', icon: '🆔', required: true, desc: '12-digit Aadhaar document' },
  { key: 'salary_file', label: 'Salary Slip / ITR', icon: '💰', required: true, desc: 'Last 3 months salary slips' },
  { key: 'bank_statement_file', label: 'Bank Statement', icon: '🏦', required: false, desc: 'Last 6 months bank statement' },
  { key: 'property_file', label: 'Property Document', icon: '🏠', required: false, desc: 'For house loan applications' },
  { key: 'gold_file', label: 'Gold Valuation', icon: '🥇', required: false, desc: 'For gold loan applications' },
  { key: 'student_proof_file', label: 'Student / Admission Proof', icon: '📋', required: false, desc: 'For student loan applications' },
]

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']

export default function DocumentUploadPage() {
  const { applicationId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [files, setFiles] = useState({})
  const [dragOver, setDragOver] = useState(null)
  const [uploading, setUploading] = useState(false)
  const refs = DOC_TYPES.reduce((acc, d) => { acc[d.key] = useRef(); return acc }, {})

  const handleFile = (key, file) => {
    if (!file) return
    if (!ALLOWED.includes(file.type)) { toast.error(`${file.name}: Only PDF, JPG, PNG allowed`); return }
    if (file.size > MAX_SIZE) { toast.error(`${file.name}: File too large (max 10MB)`); return }
    setFiles(f => ({ ...f, [key]: file }))
    toast.success(`${file.name} selected`)
  }

  const removeFile = (key) => setFiles(f => { const n = { ...f }; delete n[key]; return n })

  const handleDrop = (key, e) => {
    e.preventDefault(); setDragOver(null)
    const file = e.dataTransfer.files[0]
    handleFile(key, file)
  }

  const handleUploadAndContinue = async () => {
    const anyFile = Object.keys(files).length > 0
    if (!anyFile) { toast.error('Please upload at least one document'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('application_id', applicationId)
      Object.entries(files).forEach(([k, v]) => fd.append(k, v))
      await uploadDocuments(fd)
      toast.success('Documents uploaded successfully!')
      navigate(`/result/${applicationId}`, { state: state })
    } catch (err) {
      toast.error('Upload failed. You can still view your result.')
      navigate(`/result/${applicationId}`, { state: state })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Layout title="Upload Documents">
      <div className="fade-in" style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div className="alert alert-info">
            📋 Upload your documents to support your loan application. <strong>PAN, Aadhaar, and Salary slip are required.</strong>
            Accepted formats: PDF, JPG, PNG (max 10MB each).
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {DOC_TYPES.map(doc => (
            <div key={doc.key} className="card card-body" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ fontSize: 36, flexShrink: 0 }}>{doc.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>{doc.label}</span>
                    {doc.required && <span className="badge badge-blue" style={{ fontSize: 10 }}>Required</span>}
                    {files[doc.key] && <MdCheckCircle style={{ color: 'var(--green)', fontSize: 18 }} />}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12 }}>{doc.desc}</p>

                  {files[doc.key] ? (
                    <div className="file-preview">
                      <MdCheckCircle />
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {files[doc.key].name}
                      </span>
                      <span style={{ fontSize: 11, opacity: 0.7 }}>
                        {(files[doc.key].size / 1024).toFixed(0)} KB
                      </span>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065f46', display: 'flex' }}
                        onClick={() => removeFile(doc.key)}>
                        <MdClose />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`file-upload-zone ${dragOver === doc.key ? 'drag-over' : ''}`}
                      onDragOver={e => { e.preventDefault(); setDragOver(doc.key) }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={e => handleDrop(doc.key, e)}
                      onClick={() => refs[doc.key]?.current?.click()}
                    >
                      <input
                        type="file"
                        ref={refs[doc.key]}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => handleFile(doc.key, e.target.files[0])}
                      />
                      <div className="file-upload-icon"><MdUploadFile /></div>
                      <div className="file-upload-text">Click or drag & drop to upload</div>
                      <div className="file-upload-hint">PDF, JPG, PNG — max 10MB</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Summary */}
        <div className="card card-body" style={{ marginBottom: 24, background: 'var(--gray-50)' }}>
          <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>
            Upload Progress: {Object.keys(files).length} / {DOC_TYPES.length} documents
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${(Object.keys(files).length / DOC_TYPES.length) * 100}%` }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => navigate(`/result/${applicationId}`, { state })}>
            <MdSkipNext /> Skip & View Result
          </button>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleUploadAndContinue}
            disabled={uploading}
          >
            {uploading ? <><span className="spinner spinner-sm" /> Uploading...</>
              : <> Upload & Continue <MdArrowForward /></>}
          </button>
        </div>
      </div>
    </Layout>
  )
}
