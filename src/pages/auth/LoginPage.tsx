import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { RoleChooser } from './RoleChooser'
import { Icon } from '../../components/art/Icon'
import { useAuth } from '../../features/auth/AuthContext'
import type { UserRole } from '../../features/auth/types'
import './auth.css'

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

  return (
    <AuthLayout rawContainer>
      <div className="card">
        <form className="form card2" onSubmit={handleSubmit} noValidate>
          <h1 id="heading">Login</h1>

          {/* Segmented Portal Role Chooser */}
          <RoleChooser value={role} onChange={setRole} />

          {/* Email Field */}
          <div className="field">
            <input
              type="email"
              className="input-field"
              placeholder="Enter your Email"
              aria-label="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="field">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="Enter password"
              aria-label="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
            </button>
          </div>

          {error ? (
            <p className="form-error-msg" role="alert">
              {error}
            </p>
          ) : null}

          {/* Main Centered Login Button */}
          <button type="submit" className="button1">
            Login
          </button>

          {/* Plain Text Links Row */}
          <div className="auth-sub-links">
            <button
              type="button"
              className="auth-sub-link-btn"
              onClick={() => alert('For prototype demo: enter any email & password to sign in immediately.')}
            >
              Forgot password?
            </button>
            <button
              type="button"
              className="auth-sub-link-btn"
              onClick={() => navigate('/signup')}
            >
              Create new account
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}