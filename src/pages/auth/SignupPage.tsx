import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { RoleChooser } from './RoleChooser'
import { Icon } from '../../components/art/Icon'
import { useAuth } from '../../features/auth/AuthContext'
import type { UserRole } from '../../features/auth/types'

const STEPS = ['Account', 'Profile', 'Portal']

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [phone, setPhone] = useState('')
  const [isStudent, setIsStudent] = useState(false)
  const [emergencyContactName, setEmergencyContactName] = useState('')
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('')
  const [homeArea, setHomeArea] = useState('')
  const [role, setRole] = useState<UserRole>('citizen')
  const [error, setError] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)

  function validateAccount() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Fill in your name, email, and a password to continue.')
      return false
    }
    if (password.trim().length < 6) {
      setError('Use at least 6 characters for your password.')
      return false
    }
    return true
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step === 1) {
      if (validateAccount()) {
        setError('')
        setStep(2)
      }
      return
    }
    if (step === 2) {
      setError('')
      setStep(3)
      return
    }
    setError('')
    signup({
      name: name.trim(),
      email: email.trim(),
      role,
      avatarUrl: avatarUrl || undefined,
      phone: phone.trim() || undefined,
      isStudent,
      emergencyContactName: emergencyContactName.trim() || undefined,
      emergencyContactPhone: emergencyContactPhone.trim() || undefined,
      homeArea: homeArea.trim() || undefined,
    })
    navigate('/dashboard', { replace: true })
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || file.size > 2 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = () => setAvatarUrl(typeof reader.result === 'string' ? reader.result : '')
    reader.readAsDataURL(file)
  }

  const iconBadge = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  )

  return (
    <AuthLayout
      iconBadge={iconBadge}
      title="Create an account"
      subtitle="Join the network of responders and communities staying safe across the Philippines."
      footer={
        <span>
          Already have an account? <Link to="/login">Sign in</Link>
        </span>
      }
    >
      <form className="auth-form signup-wizard" onSubmit={handleSubmit} noValidate>
        {/* Step Indicator */}
        <div className="signup-stepper-modern" aria-label={`Step ${step} of ${STEPS.length}`}>
          {STEPS.map((label, index) => {
            const stepNum = index + 1
            const isCompleted = stepNum < step
            const isActive = stepNum === step
            return (
              <div
                key={label}
                className={`signup-step-pill ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}`}
              >
                <span className="step-num">{stepNum}</span>
                <span className="step-label">{label}</span>
              </div>
            )
          })}
        </div>

        {step === 1 && (
          <div className="signup-step-content">
            <label className="field-modern">
              <span className="field-modern__icon" aria-hidden="true">
                <Icon name="user" size={16} />
              </span>
              <input
                type="text"
                aria-label="Full name"
                autoComplete="name"
                placeholder="Full name (e.g. Maria Santos)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="field-modern">
              <span className="field-modern__icon" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                type="email"
                aria-label="Email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="field-modern">
              <span className="field-modern__icon" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                aria-label="Password"
                autoComplete="new-password"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-modern"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
              </button>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="signup-step-content">
            <div className="signup-avatar-row-modern">
              <div className="signup-avatar-preview-modern">
                {avatarUrl ? <img src={avatarUrl} alt="Profile preview" /> : <Icon name="user" size={20} />}
              </div>
              <div className="signup-avatar-actions">
                <input ref={avatarInputRef} className="signup-avatar-input" type="file" accept="image/*" onChange={handleAvatarChange} />
                <button type="button" className="auth-btn-ghost-sm" onClick={() => avatarInputRef.current?.click()}>
                  {avatarUrl ? 'Change photo' : 'Upload photo'}
                </button>
                <span className="avatar-hint">JPG or PNG under 2MB</span>
              </div>
            </div>

            <label className="field-modern">
              <span className="field-modern__icon" aria-hidden="true">
                <Icon name="phone" size={15} />
              </span>
              <input
                type="tel"
                aria-label="Phone number"
                autoComplete="tel"
                placeholder="Mobile number (+63 9XX XXX XXXX)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>

            <label className="signup-checkbox-modern">
              <input type="checkbox" checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)} />
              <span>I am currently a student / campus responder</span>
            </label>

            <div className="signup-section-label">Emergency Contact Info</div>
            <div className="signup-profile-grid">
              <label className="field-modern">
                <input
                  placeholder="Contact Name"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                />
              </label>
              <label className="field-modern">
                <input
                  type="tel"
                  placeholder="Contact Phone"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                />
              </label>
            </div>

            <label className="field-modern">
              <input
                placeholder="Home Barangay or District (optional)"
                value={homeArea}
                onChange={(e) => setHomeArea(e.target.value)}
              />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="signup-step-content">
            <p className="signup-step-kicker-modern">Select your primary role portal:</p>
            <RoleChooser value={role} onChange={setRole} />
            <div className="signup-summary-card">
              <div className="signup-summary-header">
                <strong>{name || 'Account details'}</strong>
                <span className="badge-role">{role}</span>
              </div>
              <div className="signup-summary-meta">
                <span>{email || 'No email entered'}</span>
                <span>{phone || 'No phone entered'}</span>
              </div>
            </div>
          </div>
        )}

        {error ? <p className="auth-form__error" role="alert">{error}</p> : null}

        <div className="signup-wizard-actions">
          {step > 1 ? (
            <button
              type="button"
              className="auth-btn-secondary"
              onClick={() => {
                setError('')
                setStep((current) => current - 1)
              }}
            >
              Back
            </button>
          ) : null}
          <button type="submit" className="auth-btn-primary" style={{ flex: 1 }}>
            {step === 3 ? 'Complete Registration' : 'Next step →'}
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}
