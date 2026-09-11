import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { RoleChooser } from './RoleChooser'
import { Icon } from '../../components/art/Icon'
import { Button } from '../../components/ui/Button'
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

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to coordinate, respond, or track a rescue request."
      footer={
        <span>
          New to ResQPH? <Link to="/signup">Create an account</Link>
        </span>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span className="field__label">Email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@community.ph"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Password</span>
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
          </button>
        </label>

        <RoleChooser value={role} onChange={setRole} />

        {error ? (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        ) : null}

        <Button size="lg">Log in</Button>

        <p className="auth-form__hint">
          Prototype login: any email and password will sign you in with the
          selected role. No credentials are stored.
        </p>
      </form>
    </AuthLayout>
  )
}
