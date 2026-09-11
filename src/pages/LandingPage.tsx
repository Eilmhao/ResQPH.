import { Link } from 'react-router-dom'
import { ResqLogo } from '../components/brand/ResqLogo'
import { useAuth } from '../features/auth/AuthContext'
import './LandingPage.css'

export function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="pubmat" aria-label="ResQPH landing page">

      {/* ── Photo mosaic background ───────────────────────────────── */}
      <div className="pubmat__bg" aria-hidden="true">
        <div className="pubmat__photo pubmat__photo--day">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4c/FEMA_-_32076_-_A_water_rescue_team_in_a_boat_searching_for_people_in_Oklahoma.jpg"
            alt=""
            draggable="false"
          />
        </div>
        <div className="pubmat__photo pubmat__photo--night">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/20/Coast_Guard_rescue_boat_in_2016_Baton_Rouge_Louisiana_flood.jpg"
            alt=""
            draggable="false"
          />
        </div>
        {/* dark gradient overlay so text is always readable */}
        <div className="pubmat__overlay" />
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="pubmat__content">

        {/* Top bar */}
        <header className="pubmat__header">
          <div className="pubmat__brand">
            <ResqLogo size={28} />
            <span className="pubmat__brand-name">ResQPH</span>
          </div>

          <div className="pubmat__signal" aria-label="Prototype status">
            <span className="pubmat__signal-dot" aria-hidden="true" />
            <span>Field network / prototype</span>
          </div>

          <div className="pubmat__header-actions">
            {user && (
              <Link to="/dashboard" className="pubmat__dash-link">
                Open Dashboard →
              </Link>
            )}
            <Link to="/login" className="pubmat__auth-link">
              Log in
            </Link>
            <Link to="/signup" className="pubmat__auth-link pubmat__auth-link--strong">
              Create account
            </Link>
          </div>
        </header>

        {/* Centre hero copy */}
        <main className="pubmat__hero" id="main-content">
          <div className="pubmat__location">
            <span>01</span>
            <span>Metro Manila study area</span>
            <span className="pubmat__location-line" aria-hidden="true" />
          </div>

          <p className="pubmat__eyebrow" aria-label="Category">
            <span className="pubmat__eyebrow-dot" aria-hidden="true" />
            Flood-Aware Rescue Coordination
          </p>

          <h1 className="pubmat__title">
            When Every
            <br />
            Second
            <br />
            <span className="pubmat__title-accent">Counts.</span>
          </h1>

          <p className="pubmat__lead">
            Connecting communities in crisis with verified rescue teams —
            guided by real-time flood-aware routing across Metro Manila.
          </p>

          <div className="pubmat__detail-row" aria-label="Rescue network details">
            <span>Flood-aware routing</span>
            <span aria-hidden="true">/</span>
            <span>Community-led response</span>
          </div>

          {/* CTA */}
          <div className="pubmat__actions">
            {user ? (
              <Link to="/dashboard" className="pubmat__btn pubmat__btn--primary">
                Open Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/signup" className="pubmat__btn pubmat__btn--primary">
                  Get Started →
                </Link>
                <Link to="/login" className="pubmat__btn pubmat__btn--ghost">
                  Log In
                </Link>
              </>
            )}
          </div>

          <nav className="pubmat__portals" aria-label="Choose a portal">
            <span className="pubmat__portals-label">Portal access</span>
            <Link to="/login?role=coordinator">Dispatcher console <span aria-hidden="true">↗</span></Link>
            <Link to="/login?role=rescuer">Rescuer portal <span aria-hidden="true">↗</span></Link>
            <Link to="/login?role=citizen">Citizen requests <span aria-hidden="true">↗</span></Link>
          </nav>
        </main>

        {/* Bottom strip */}
        <footer className="pubmat__footer">
          <p className="pubmat__tagline">
            Stronger Communities.&nbsp; Safer Philippines.
          </p>
          <p className="pubmat__disclaimer">
            Academic prototype · Metro Manila · Not for operational use
          </p>
        </footer>

      </div>
    </div>
  )
}
