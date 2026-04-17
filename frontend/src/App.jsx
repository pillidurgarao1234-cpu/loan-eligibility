import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './components/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import LoanCategoryPage from './pages/LoanCategoryPage'
import LoanFormPage from './pages/LoanFormPage'
import DocumentUploadPage from './pages/DocumentUploadPage'
import PredictionResultPage from './pages/PredictionResultPage'
import HistoryPage from './pages/HistoryPage'
import ProfilePage from './pages/ProfilePage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="spinner" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/loan-category" element={<ProtectedRoute><LoanCategoryPage /></ProtectedRoute>} />
      <Route path="/loan-form/:type" element={<ProtectedRoute><LoanFormPage /></ProtectedRoute>} />
      <Route path="/upload-documents/:applicationId" element={<ProtectedRoute><DocumentUploadPage /></ProtectedRoute>} />
      <Route path="/result/:applicationId" element={<ProtectedRoute><PredictionResultPage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
