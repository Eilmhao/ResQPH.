import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ResqLogo } from '../../components/brand/ResqLogo'
import './auth.css'

interface AuthLayoutProps {
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  iconBadge?: ReactNode
  hideHeader?: boolean
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  iconBadge,
  hideHeader = false,
}: AuthLayoutProps) {
  return (
    <div className="auth-sky-page">
      {/* ── Sky & Clouds Realistic Background ── */}
      <div className="auth-sky-bg" aria-hidden="true">
        <div className="auth-sky-gradient" />
        <img
          className="auth-clouds-img"
          src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80"
          alt=""
          loading="eager"
        />
        <div className="auth-clouds-tint" />
      </div>

      {/* ── Glowing Concentric Radial Rings (radar/beacon aura) ── */}
      <div className="auth-radial-rings" aria-hidden="true">
        <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="500" cy="500" r="260" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="500" cy="500" r="370" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />
          <circle cx="500" cy="500" r="490" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" />
        </svg>
      </div>

      {/* ── Top-Left Brand ("ResQPH" logo badge) ── */}
      <header className="auth-top-brand">
        <Link to="/" className="auth-brand-link">
          <div className="auth-brand-badge">
            <ResqLogo size={22} />
          </div>
          <span className="auth-brand-name">ResQPH</span>
        </Link>
      </header>

      {/* ── Central Glass Card ── */}
      <main className="auth-card-container">
        <div className="auth-glass-card">
          {iconBadge && (
            <div className="auth-icon-badge" aria-hidden="true">
              {iconBadge}
            </div>
          )}

          {!hideHeader && title && (
            <div className="auth-card-header">
              <h1 className="auth-card-title">{title}</h1>
              {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}
            </div>
          )}

          <div className="auth-card-body">{children}</div>

          {footer && <div className="auth-card-footer">{footer}</div>}
        </div>
      </main>
    </div>
  )
}
