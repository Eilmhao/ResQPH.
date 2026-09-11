import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { RoleChooser } from './RoleChooser'
import { Icon } from '../../components/art/Icon'
import { Button } from '../../components/ui/Button'
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
      if (validateAccount()) { setError(''); setStep(2) }
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

  return (
    <AuthLayout
      title="Get started"
      subtitle="Join the network of people helping communities stay safe."
      footer={<span>Already have an account? <Link to="/login">Log in</Link></span>}
    >
      <form className="auth-form signup-wizard" onSubmit={handleSubmit} noValidate>
        <div className="signup-stepper" aria-label={`Step ${step} of ${STEPS.length}`}>
          {STEPS.map((label, index) => (
            <span key={label} className={index + 1 <= step ? 'is-active' : ''}>
              <b>0{index + 1}</b>{label}
            </span>
          ))}
        </div>

        {step === 1 && (
          <div className="signup-step-content">
            <p className="signup-step-kicker">Create your account</p>
            <label className="field"><span className="field__label">Full name</span><input type="text" autoComplete="name" placeholder="Juan dela Cruz" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="field"><span className="field__label">Email</span><input type="email" autoComplete="email" placeholder="you@community.ph" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label className="field"><span className="field__label">Password</span><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}><Icon name={showPassword ? 'eye-off' : 'eye'} size={16} /></button></label>
          </div>
        )}

        {step === 2 && (
          <div className="signup-step-content">
            <p className="signup-step-kicker">Help responders understand your situation</p>
            <div className="signup-avatar-row"><div className="signup-avatar-preview">{avatarUrl ? <img src={avatarUrl} alt="Profile preview" /> : <Icon name="user" size={18} />}</div><input ref={avatarInputRef} className="signup-avatar-input" type="file" accept="image/*" onChange={handleAvatarChange} /><button type="button" className="signup-upload" onClick={() => avatarInputRef.current?.click()}>Add profile photo</button></div>
            <label className="field"><span className="field__label">Phone number</span><input type="tel" autoComplete="tel" placeholder="For dispatch follow-up" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            <label className="signup-check"><input type="checkbox" checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)} /><span>I am a student</span></label>
            <div className="signup-profile-heading signup-profile-heading--sub">Emergency contact</div>
            <div className="signup-profile-grid"><label className="field"><span className="field__label">Name</span><input value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} /></label><label className="field"><span className="field__label">Phone</span><input type="tel" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} /></label></div>
            <label className="field"><span className="field__label">Home area <small>(optional)</small></span><input placeholder="Barangay or general area" value={homeArea} onChange={(e) => setHomeArea(e.target.value)} /></label>
          </div>
        )}

        {step === 3 && (
          <div className="signup-step-content">
            <p className="signup-step-kicker">Choose the portal you will use</p>
            <RoleChooser value={role} onChange={setRole} />
            <div className="signup-review"><strong>{name || 'Your profile'}</strong><span>{email || 'No email entered'}</span><span>{phone || 'No phone added'}</span></div>
          </div>
        )}

        {error ? <p className="auth-form__error" role="alert">{error}</p> : null}

        <div className="signup-wizard-actions">
          {step > 1 ? <Button variant="ghost" type="button" onClick={() => { setError(''); setStep((current) => current - 1) }}>Back</Button> : <span />}
          <Button size="lg" type="submit">{step === 3 ? 'Create account' : 'Next'}</Button>
        </div>

        <p className="auth-form__hint">Your profile is saved only in this browser for this prototype.</p>
      </form>
    </AuthLayout>
  )
}
