import { Link } from 'react-router-dom'
import { ResqLogo } from '../components/brand/ResqLogo'
import { useAuth } from '../features/auth/AuthContext'
import './LandingPage.css'

export function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="resq-minimal-landing" aria-label="ResQPH">
      {/* ── Background: White with Lowered-Opacity Rescue Image ── */}
      <div className="resq-landing__bg" aria-hidden="true">
        <img
          src="/philippine-flood-rescue.jpg"
          alt=""
          className="resq-landing__bg-photo"
          loading="eager"
        />
        <div className="resq-landing__bg-overlay" />
      </div>

      {/* ── Top Bar ── */}
      <header className="resq-minimal-header">
        <div className="resq-minimal-header__brand">
          <ResqLogo size={28} />
          <span className="resq-minimal-header__name">ResQPH</span>
        </div>
        <div className="resq-minimal-header__actions">
          {user ? (
            <Link to="/dashboard" className="resq-minimal-header__link">
              Dashboard →
            </Link>
          ) : (
            <Link to="/login" className="resq-minimal-header__link">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* ── Center Content: ResQPH ── */}
      <main className="resq-minimal-center">
        <div className="resq-minimal-card">
          <div className="resq-minimal-logo">
            <ResqLogo size={72} />
          </div>

          <h1 className="resq-minimal-title">ResQPH</h1>

          <div className="resq-minimal-actions">
            {user ? (
              <Link to="/dashboard" className="resq-minimal-btn resq-minimal-btn--primary">
                Open Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="resq-minimal-btn resq-minimal-btn--primary">
                  Get Started →
                </Link>
                <Link to="/login?role=rescuer" className="resq-minimal-btn resq-minimal-btn--secondary">
                  Rescuer Portal
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
