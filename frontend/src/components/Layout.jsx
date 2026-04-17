import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'
import {
  MdDashboard, MdHistory, MdPerson, MdLogout, MdMenu, MdClose,
  MdAttachMoney, MdUploadFile, MdHome
} from 'react-icons/md'

export default function Layout({ children, title }) {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logoutUser()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
    { to: '/loan-category', icon: <MdAttachMoney />, label: 'Apply for Loan' },
    { to: '/history', icon: <MdHistory />, label: 'Loan History' },
    { to: '/profile', icon: <MdPerson />, label: 'My Profile' },
  ]

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="app-layout">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>Loan<span>Wise</span> AI</h2>
          <p>Eligibility Platform</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '10px 4px' }}>
            <div className="avatar">{initials}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{user?.email}</div>
            </div>
          </div>
          <button className="nav-item btn-ghost" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#fca5a5' }}>
            <MdLogout /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: 'var(--navy)' }}
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <MdMenu />
            </button>
            <span className="topbar-title">{title}</span>
          </div>
          <div className="topbar-right">
            <NavLink to="/loan-category">
              <button className="btn btn-primary btn-sm">+ New Application</button>
            </NavLink>
            <NavLink to="/profile">
              <div className="avatar" title={user?.name}>{initials}</div>
            </NavLink>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  )
}
