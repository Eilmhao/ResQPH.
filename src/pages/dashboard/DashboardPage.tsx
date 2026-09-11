import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getApiHealth } from '../../api/health'
import { useAuth } from '../../features/auth/AuthContext'
import { ROLE_LABELS } from '../../features/auth/types'
import { ResqLogo } from '../../components/brand/ResqLogo'
import { Icon, type IconName } from '../../components/art/Icon'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { StatusPill, type StatusTone } from '../../components/ui/StatusPill'
import { useMissions } from '../../features/missions/MissionContext'
import { OfflineIndicator } from '../../features/offline/OfflineIndicator'
import { CitizenView } from './views/CitizenView'
import { CoordinatorView } from './views/CoordinatorView'
import { RescuerView } from './views/RescuerView'
import { LocalizedForecastWidget } from './views/shared'
import type { NavSection } from './views/navTypes'
import './dashboard.css'

type NavItem = {
  id: NavSection
  icon: IconName
  label: string
  roles: ('citizen' | 'rescuer' | 'coordinator')[]
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',   icon: 'pin',        label: 'Overview',   roles: ['citizen', 'rescuer', 'coordinator'] },
  { id: 'inquiries',  icon: 'alert',      label: 'Inquiries',  roles: ['citizen', 'coordinator'] },
  { id: 'missions',   icon: 'route',      label: 'Missions',   roles: ['rescuer', 'coordinator'] },
  { id: 'teams',      icon: 'volunteers', label: 'Teams',      roles: ['coordinator'] },
  { id: 'incidents',  icon: 'shield',     label: 'Incidents',  roles: ['coordinator'] },
  { id: 'map',        icon: 'shield',     label: 'Hazard Map', roles: ['citizen', 'rescuer', 'coordinator'] },
]

export function DashboardPage() {
  const { user, logout, updateProfile } = useAuth()
  const {
    isOffline,
    toggleOffline,
    resetToInitialData,
    pendingSyncCount,
    hourlyForecast,
    waterStations,
  } = useMissions()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<NavSection>('overview')
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profileAvatar, setProfileAvatar] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileIsStudent, setProfileIsStudent] = useState(false)
  const [profileEmergencyName, setProfileEmergencyName] = useState('')
  const [profileEmergencyPhone, setProfileEmergencyPhone] = useState('')
  const [profileHomeArea, setProfileHomeArea] = useState('')
  const [profileError, setProfileError] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const healthQuery = useQuery({ queryKey: ['api-health'], queryFn: getApiHealth })

  const apiState: { tone: StatusTone; label: string; detail?: string } = healthQuery.isPending
    ? { tone: 'pending', label: 'Checking API' }
    : healthQuery.isError
      ? { tone: 'offline', label: 'API offline' }
      : { tone: 'online', label: 'API online', detail: `v${healthQuery.data?.version ?? '—'}` }

  const view = useMemo(() => {
    switch (user?.role) {
      case 'coordinator':
        return <CoordinatorView navSection={activeNav} />
      case 'rescuer':
        return <RescuerView navSection={activeNav} />
      default:
        return <CitizenView navSection={activeNav} />
    }
  }, [user?.role, activeNav])

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  function openProfile() {
    setProfileName(user?.name ?? '')
    setProfileEmail(user?.email ?? '')
    setProfileAvatar(user?.avatarUrl ?? '')
    setProfilePhone(user?.phone ?? '')
    setProfileIsStudent(user?.isStudent ?? false)
    setProfileEmergencyName(user?.emergencyContactName ?? '')
    setProfileEmergencyPhone(user?.emergencyContactPhone ?? '')
    setProfileHomeArea(user?.homeArea ?? '')
    setProfileError('')
    setProfileOpen(true)
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setProfileError('Choose an image smaller than 2 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setProfileAvatar(typeof reader.result === 'string' ? reader.result : '')
    reader.readAsDataURL(file)
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!profileName.trim() || !profileEmail.trim()) {
      setProfileError('Name and email are required.')
      return
    }
    updateProfile({
      name: profileName,
      email: profileEmail,
      avatarUrl: profileAvatar || undefined,
      phone: profilePhone.trim() || undefined,
      isStudent: profileIsStudent,
      emergencyContactName: profileEmergencyName.trim() || undefined,
      emergencyContactPhone: profileEmergencyPhone.trim() || undefined,
      homeArea: profileHomeArea.trim() || undefined,
    })
    setProfileOpen(false)
  }

  if (!user) return null

  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('')

  return (
    <div className={`dash${menuOpen ? ' dash--menu-open' : ''}`}>
      <aside className="dash__side">
        <div className="dash__brand">
          <ResqLogo size={26} />
          <span>ResQPH</span>
        </div>

        {/* Current role indicator */}
        <div className="dash__role-indicator">
          <span className="role-indicator-label">Logged in as</span>
          <span className="role-indicator-value">{user.role === 'coordinator' ? 'Dispatcher / Coordinator' : ROLE_LABELS[user.role]}</span>
          <button type="button" className="dash__switch-portal" onClick={() => navigate('/login')}>
            Switch portal
          </button>
        </div>

        <nav className="dash__nav" aria-label="Dashboard">
          {NAV_ITEMS.filter((item) => item.roles.includes(user.role as any)).map((item) => (
            <button
              key={item.id}
              type="button"
              className={`dash__nav-item${activeNav === item.id ? ' is-active' : ''}`}
              onClick={() => { setActiveNav(item.id); setMenuOpen(false) }}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Prototype tools */}
        <div className="dash__side-tools">
          <button
            type="button"
            className={`tool-btn ${isOffline ? 'is-offline-active' : ''}`}
            onClick={toggleOffline}
            title="Simulate internet connectivity loss during storms"
          >
            <Icon name={isOffline ? 'wifi-off' : 'refresh'} size={15} />
            <span>{isOffline ? 'Simulating Offline' : 'Test Offline Mode'}</span>
          </button>

          <button
            type="button"
            className="tool-btn"
            onClick={resetToInitialData}
            title="Reset requests and missions to initial mock scenario"
          >
            <Icon name="refresh" size={15} />
            <span>Reset Demo Data</span>
          </button>
        </div>

        <button className="dash__logout" type="button" onClick={handleLogout}>
          <Icon name="logout" size={18} />
          <span>Sign out</span>
        </button>
      </aside>

      <div className="dash__main">
        <header className="dash__topbar">
          <button
            className="dash__menu-btn"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name="menu" size={20} />
          </button>

          <div className="dash__topbar-title">
            <p className="dash__role-tag">
              {ROLE_LABELS[user.role]} Console · Metro Manila Study Area
            </p>
            <h1>
              {user.role === 'citizen' && 'Citizen Distress & Volunteer Portal'}
              {user.role === 'rescuer' && 'Field Rescuer Mobile Guidance'}
              {user.role === 'coordinator' && 'Disaster Response Dispatcher Oversight'}
            </h1>
          </div>

          <div className="dash__topbar-right">

            <StatusPill
              tone={isOffline ? 'pending' : apiState.tone}
              label={isOffline ? `Offline (${pendingSyncCount} queued)` : apiState.label}
              detail={apiState.detail}
            />
            <button className="dash__topbar-logout" type="button" onClick={handleLogout}>
              <Icon name="logout" size={16} />
              <span>Log out</span>
            </button>
            <button className="dash__avatar dash__avatar-button" type="button" onClick={openProfile} aria-label="Edit profile">
              {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : initials || 'RQ'}
            </button>
          </div>
        </header>

        {/* Offline notification banner if offline mode active */}
        <OfflineIndicator />

        {user.role === 'citizen' && (
          <div className="dash__weather-strip">
            <LocalizedForecastWidget hourly={hourlyForecast} waterStations={waterStations} />
          </div>
        )}

        <main className="dash__content">{view}</main>
      </div>

      <Modal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Edit profile"
        subtitle="Keep your account details current for the response team."
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setProfileOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="profile-form">Save profile</Button>
          </>
        }
      >
        <form id="profile-form" className="profile-form" onSubmit={handleProfileSubmit}>
          <div className="profile-avatar-editor">
            <div className="profile-avatar-editor__preview">
              {profileAvatar ? <img src={profileAvatar} alt="Profile preview" /> : initials || 'RQ'}
            </div>
            <div>
              <strong>Profile photo</strong>
              <p>Use a clear photo responders can recognize.</p>
              <input ref={avatarInputRef} className="profile-avatar-editor__input" type="file" accept="image/*" onChange={handleAvatarChange} />
              <Button variant="outline" size="sm" type="button" onClick={() => avatarInputRef.current?.click()}>
                {profileAvatar ? 'Change photo' : 'Upload photo'}
              </Button>
            </div>
          </div>
          <label className="profile-form__field">
            <span>Full name</span>
            <input value={profileName} onChange={(event) => setProfileName(event.target.value)} autoComplete="name" />
          </label>
          <label className="profile-form__field">
            <span>Email address</span>
            <input type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} autoComplete="email" />
          </label>
          <label className="profile-form__field">
            <span>Phone number</span>
            <input type="tel" value={profilePhone} onChange={(event) => setProfilePhone(event.target.value)} autoComplete="tel" placeholder="For dispatch follow-up" />
          </label>
          <label className="profile-form__checkbox">
            <input type="checkbox" checked={profileIsStudent} onChange={(event) => setProfileIsStudent(event.target.checked)} />
            <span>I am a student</span>
          </label>
          <div className="profile-form__section-label">Emergency contact</div>
          <div className="profile-form__grid">
            <label className="profile-form__field">
              <span>Name</span>
              <input value={profileEmergencyName} onChange={(event) => setProfileEmergencyName(event.target.value)} autoComplete="name" />
            </label>
            <label className="profile-form__field">
              <span>Phone</span>
              <input type="tel" value={profileEmergencyPhone} onChange={(event) => setProfileEmergencyPhone(event.target.value)} autoComplete="tel" />
            </label>
          </div>
          <label className="profile-form__field">
            <span>Home area <small>(optional)</small></span>
            <input value={profileHomeArea} onChange={(event) => setProfileHomeArea(event.target.value)} placeholder="Barangay or general area" />
          </label>
          {profileError ? <p className="profile-form__error" role="alert">{profileError}</p> : null}
        </form>
      </Modal>
    </div>
  )
}
