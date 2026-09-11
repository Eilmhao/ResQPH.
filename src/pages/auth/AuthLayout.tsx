import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ResqLogo } from '../../components/brand/ResqLogo'
import './auth.css'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className={`auth ${title === 'Get started' ? 'auth--signup' : 'auth--login'}`}>
      <Link to="/" className="auth__floating-brand">
        <ResqLogo size={24} />
        <span>ResQPH</span>
      </Link>
      <div className="auth__photo-bg" aria-hidden="true">
        <div className="auth__photo auth__photo--left">
          <img src="/resqph-flood-rescue.png" alt="" />
        </div>
        <div className="auth__photo-overlay" />
      </div>
      {/* Editorial brand panel */}
      <aside className="auth__aside" aria-hidden="true">
        <div className="auth__aside-scene" />
        <div className="auth__aside-content">
          <Link to="/" className="auth__brand" aria-hidden="false">
            <ResqLogo size={30} />
            <span>ResQPH</span>
          </Link>
          <p className="auth__aside-quote">
            Real People.
            <br />
            Real Help.
          </p>
          <p className="auth__aside-sub">
            Connecting affected communities with verified volunteers and rescue
            teams — when every second matters.
          </p>
          <div className="auth__signal-grid">
            <span><strong>01</strong> Flood-aware routes</span>
            <span><strong>02</strong> Coordinated response</span>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="auth__panel">
        <div className="auth__form-wrap">
          <Link to="/" className="auth__brand auth__brand--mobile">
            <ResqLogo size={26} />
            <span>ResQPH</span>
          </Link>
          <h1 className="auth__title">{title}</h1>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
          <div className="auth__footer">{footer}</div>
        </div>
      </main>
    </div>
  )
}
