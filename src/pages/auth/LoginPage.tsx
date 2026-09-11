import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { RoleChooser } from './RoleChooser'
import { Icon } from '../../components/art/Icon'
import { useAuth } from '../../features/auth/AuthContext'
import type { UserRole } from '../../features/auth/types'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const requestedRole = searchParams.get('role')
  const [role, setRole] = useState<UserRole>(
    requestedRole === 'coordinator' || requestedRole === 'rescuer' ? requestedRole : 'citizen',
  )
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password to continue.')
      return
    }
    setError('')
    login({ email: email.trim(), role })
    navigate('/dashboard', { replace: true })
  }

  function handleQuickSocialLogin(provider: 'google' | 'facebook' | 'apple') {
    const dummyEmails: Record<string, string> = {
      google: 'user@gmail.com',
      facebook: 'user@meta.ph',
      apple: 'user@icloud.com',
    }
    login({ email: dummyEmails[provider] || 'quickuser@resq.ph', role })
    navigate('/dashboard', { replace: true })
  }

  const iconBadge = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H7" />
      <path d="M11 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6" />
    </svg>
  )

  return (
    <AuthLayout
      iconBadge={iconBadge}
      title="Sign in with email"
      subtitle="Connect affected communities, field rescuers, and dispatchers in real time."
      footer={
        <span>
          New to ResQPH? <Link to="/signup">Create an account</Link>
        </span>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Segmented Portal Role Chooser */}
        <RoleChooser value={role} onChange={setRole} />

        {/* Email Field with leading mail icon */}
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {/* Password Field with leading lock icon & toggle */}
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
            autoComplete="current-password"
            placeholder="Password"
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

        <div className="auth-forgot-row">
          <button
            type="button"
            className="auth-forgot-link"
            onClick={() => alert('For prototype demo: enter any email & password to sign in immediately.')}
          >
            Forgot password?
          </button>
        </div>

        {error ? (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        ) : null}

        {/* Primary Action Button */}
        <button type="submit" className="auth-btn-primary">
          Get Started
        </button>

        {/* Divider */}
        <div className="auth-divider">
          <span>Or sign in with</span>
        </div>

        {/* Social / Fast Auth Buttons */}
        <div className="auth-social-row">
          {/* Google */}
          <button
            type="button"
            className="auth-social-btn"
            onClick={() => handleQuickSocialLogin('google')}
            aria-label="Sign in with Google"
            title="Sign in with Google"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
              />
            </svg>
          </button>

          {/* Facebook */}
          <button
            type="button"
            className="auth-social-btn"
            onClick={() => handleQuickSocialLogin('facebook')}
            aria-label="Sign in with Facebook"
            title="Sign in with Facebook"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* Apple */}
          <button
            type="button"
            className="auth-social-btn"
            onClick={() => handleQuickSocialLogin('apple')}
            aria-label="Sign in with Apple"
            title="Sign in with Apple"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.86c.65-.8 1.1-1.91.98-3.03-.95.04-2.11.64-2.78 1.43-.59.69-1.12 1.81-.98 2.9.01 0 .07.01.12.01.96 0 2.01-.51 2.66-1.31z" />
            </svg>
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}
