import { useState, useRef } from 'react'
import { Button } from '../../../components/ui/Button'
import { Icon } from '../../../components/art/Icon'
import { Modal } from '../../../components/ui/Modal'
import { useMissions } from '../../../features/missions/MissionContext'
import { SAVED_CITIZEN_PROFILE } from '../../../features/missions/mockData'
import type { SeverityLevel } from '../../../features/missions/types'
import { InteractiveFloodMap } from '../../../features/map/InteractiveFloodMap'
import {
  EmergencyHotlinesModal,
  EmergencyPreparednessGuide,
  Section,
  VulnerabilitiesBadges,
  WeatherAlertBanner,
  SEVERITY_CONFIG,
} from './shared'

import type { NavSection } from './navTypes'

export function CitizenView({
  navSection = 'overview',
  onNavigateTab,
  onOpenProfile: _onOpenProfile,
}: {
  navSection?: NavSection
  onNavigateTab?: (section: NavSection) => void
  onOpenProfile?: () => void
}) {
  const {
    activeCitizenRequest,
    missions,
    createRescueRequest,
    updateRequestStatus,
    submitHazardReport,
  } = useMissions()

  // Modal / Form UI states
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showHazardModal, setShowHazardModal] = useState(false)
  const [showHotlinesModal, setShowHotlinesModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Step wizard state
  const [stepA_severity, setStepA_severity] = useState<SeverityLevel>('moderate')
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)

  // Branch inputs
  const [locationAddress, setLocationAddress] = useState('')
  const [locationError, setLocationError] = useState('')
  const [headcount, setHeadcount] = useState('4')
  const [vulnerabilities, setVulnerabilities] = useState({
    infant: false,
    senior: false,
    pwd: false,
    pregnant: false,
  })
  const [hasMedical, setHasMedical] = useState(false)
  const [medicalDetails, setMedicalDetails] = useState('')
  const [sceneFloodDepth, setSceneFloodDepth] = useState('Waist-deep')
  const [photoAttached, setPhotoAttached] = useState(false)

  // Volunteer Hazard Reporting state
  const [hazardLocation, setHazardLocation] = useState('Loyola St. cor. Dalupan')
  const [hazardType, setHazardType] = useState<'Impassable Flood' | 'Blocked Road' | 'Submerged Obstacle' | 'Live Electrical Wire'>('Impassable Flood')
  const [hazardSeverity, setHazardSeverity] = useState<SeverityLevel>('high')
  const [hazardPhoto, setHazardPhoto] = useState(false)
  const [hazardSubmittedAlert, setHazardSubmittedAlert] = useState(false)

  // Hold-to-send SOS state
  const [isHolding, setIsHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const holdTimerRef = useRef<number | null>(null)
  const holdStartRef = useRef<number>(0)

  function startHold() {
    setIsHolding(true)
    setHoldProgress(0)
    holdStartRef.current = Date.now()

    if (holdTimerRef.current) {
      window.clearInterval(holdTimerRef.current)
    }

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current
      const progress = Math.min(elapsed / 1000, 1)
      setHoldProgress(progress)
      if (progress >= 1) {
        window.clearInterval(interval)
        holdTimerRef.current = null
        setIsHolding(false)
        setHoldProgress(0)
        handleStartRequest()
      }
    }, 40)
    holdTimerRef.current = interval
  }

  function cancelHold() {
    if (holdTimerRef.current) {
      window.clearInterval(holdTimerRef.current)
      holdTimerRef.current = null
    }
    setIsHolding(false)
    setHoldProgress(0)
  }

  function handleSosClick() {
    cancelHold()
    handleStartRequest()
  }

  function handleQuickService(defaultSeverity: SeverityLevel, medical = false) {
    setStepA_severity(defaultSeverity)
    setHasMedical(medical)
    if (medical) {
      setMedicalDetails('Urgent medical support requested via Medical Aid service.')
    }
    handleStartRequest()
  }
  const isBranch1 = stepA_severity === 'low' || stepA_severity === 'low-moderate'
  const isBranch2 = stepA_severity === 'moderate'
  const isBranch3 = stepA_severity === 'high' || stepA_severity === 'severe'

  function handleStartRequest() {
    setShowRequestForm(true)
    setCurrentStepIndex(0) // Step A: Triage
    setLocationAddress('')
    setLocationError('')
  }

  function handleUseGPS() {
    setLocationError('')
    setLocationAddress('Block 5 Lot 21 Jhocson St., Sampaloc, Manila [GPS: 14.6042° N, 120.9946° E]')
  }

  function handleSubmitRequest() {
    if (!locationAddress.trim()) {
      setLocationError('Add the current rescue location or use GPS before submitting.')
      return
    }

    // Generate appropriate payload based on branch
    if (isBranch3) {
      // Auto-pull from profile
      createRescueRequest({
        citizenName: SAVED_CITIZEN_PROFILE.name,
        citizenPhone: SAVED_CITIZEN_PROFILE.phone,
        severity: stepA_severity,
        branchTaken: 3,
        location: {
          address: locationAddress.trim(),
          coordinates: SAVED_CITIZEN_PROFILE.coordinates,
        },
        headcount: SAVED_CITIZEN_PROFILE.headcount,
        vulnerabilities: SAVED_CITIZEN_PROFILE.vulnerabilities,
        medicalNeeds: SAVED_CITIZEN_PROFILE.medicalNeeds,
        medicalDetails: SAVED_CITIZEN_PROFILE.medicalDetails,
        floodDepth: SEVERITY_CONFIG[stepA_severity].depth,
        isAutoPulledProfile: true,
      })
    } else if (isBranch2) {
      // Branch 2: Moderate
      createRescueRequest({
        citizenName: 'Maria Santos',
        citizenPhone: '+63 917 555 4321',
        severity: stepA_severity,
        branchTaken: 2,
        location: {
          address: locationAddress.trim(),
          coordinates: [120.9946, 14.6042],
        },
        headcount: parseInt(headcount, 10) || 2,
        vulnerabilities: { infant: false, senior: false, pwd: false, pregnant: false },
        medicalNeeds: hasMedical,
        medicalDetails: hasMedical ? 'Medical support requested during triage.' : undefined,
        floodDepth: 'Waist-deep',
        isAutoPulledProfile: false,
      })
    } else {
      // Branch 1: Low / Low-Moderate Detailed
      createRescueRequest({
        citizenName: 'Maria Santos',
        citizenPhone: '+63 917 555 4321',
        severity: stepA_severity,
        branchTaken: 1,
        location: {
          address: locationAddress.trim(),
          coordinates: [120.9946, 14.6042],
        },
        headcount: parseInt(headcount, 10) || 1,
        vulnerabilities,
        medicalNeeds: hasMedical,
        medicalDetails,
        floodDepth: sceneFloodDepth,
        photoUrl: photoAttached ? 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500' : undefined,
        isAutoPulledProfile: false,
      })
    }

    setShowRequestForm(false)
  }

  function handleHazardSubmit(e: React.FormEvent) {
    e.preventDefault()
    submitHazardReport({
      reporterName: 'Citizen Volunteer (Maria)',
      locationName: hazardLocation,
      coordinates: [120.9955, 14.6052],
      hazardType,
      severity: hazardSeverity,
      floodDepth: SEVERITY_CONFIG[hazardSeverity].depth,
      photoUrl: hazardPhoto ? 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500' : undefined,
    })
    setShowHazardModal(false)
    setHazardSubmittedAlert(true)
    setTimeout(() => setHazardSubmittedAlert(false), 5000)
  }

  const activeReq = activeCitizenRequest
  const activeMission = missions.find((m) => m.requestId === activeReq?.id) || missions[0]
  const currentRouteExplanation =
    activeMission?.routeDelayExplanation ||
    'Rescue Team arrival: 9 minutes. All possible shortcuts are flooded and needs to head another alternative routes "Loyola St.".'
  const currentEtaMinutes = activeMission?.etaMinutes || 9

  return (
    <div className="citizen-dashboard">
      {/* Always-visible banners */}
      <WeatherAlertBanner />

      {hazardSubmittedAlert && (
        <div className="alert-banner-success">
          <Icon name="check" size={18} />
          <span>
            <strong>Hazard Report Submitted!</strong> Dispatch and automated routing engine have
            been updated to warn rescue units.
          </span>
        </div>
      )}

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      {navSection === 'overview' && (
        <div className="citizen-mockup-overview">
          {/* 1. Location Card */}
          <div className="citizen-loc-card">
            <div className="citizen-loc-main">
              <span className="citizen-loc-dart" aria-hidden="true">
                <Icon name="navigation" size={17} />
              </span>
              <div className="citizen-loc-text">
                <span className="citizen-loc-name">Brgy. Tumana, Marikina City</span>
                <span className="citizen-loc-coords font-mono">14.6532 N · 121.0912 E</span>
              </div>
            </div>
            <div className="citizen-loc-gps-pill">
              <span className="citizen-loc-gps-dot" />
              <span>GPS Lock</span>
            </div>
          </div>

          {/* Active distress quick bar if citizen has pending/active request */}
          {activeReq && activeReq.status !== 'completed' && activeReq.status !== 'cancelled' && (
            <div
              className="citizen-active-distress-banner"
              role="button"
              tabIndex={0}
              onClick={() => onNavigateTab?.('inquiries')}
            >
              <div className="distress-banner-left">
                <span className="distress-banner-pulse" />
                <span>
                  <strong>Distress Signal {activeReq.id}:</strong> Rescuers {activeReq.status.toUpperCase()} ({currentEtaMinutes}m ETA)
                </span>
              </div>
              <span className="distress-banner-action">View Telemetry →</span>
            </div>
          )}

          {/* 2. Hero SOS Card */}
          <div className="citizen-sos-card">
            <div className="citizen-sos-backdrop-img" style={{ backgroundImage: "url('/philippine-flood-rescue.jpg')" }} />
            <div className="citizen-sos-overlay" />

            <div className="citizen-sos-channel-pill">
              <span className="citizen-channel-dot" />
              <span>Emergency Channel Open</span>
            </div>

            <div className="citizen-sos-btn-container">
              <button
                type="button"
                className={`citizen-sos-circle-btn ${isHolding ? 'is-holding' : ''}`}
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                onClick={handleSosClick}
                aria-label="REQUEST EMERGENCY RESCUE"
              >
                <span className="citizen-sos-title">SOS</span>
                <span className="citizen-sos-sub">HOLD TO SEND</span>
                {isHolding && (
                  <svg className="citizen-sos-ring-progress" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r="76"
                      strokeDasharray="477"
                      strokeDashoffset={477 * (1 - holdProgress)}
                    />
                  </svg>
                )}
              </button>
            </div>

            <p className="citizen-sos-info-text">
              Sends your location, household size, and hazard type to the nearest response unit.
            </p>

            <button
              type="button"
              className="citizen-sos-hotline-btn"
              onClick={() => setShowHotlinesModal(true)}
            >
              <Icon name="phone" size={15} />
              <span>Call 911 hotline</span>
            </button>
          </div>

          {/* 3. Section: REQUEST ASSISTANCE (4 Services) */}
          <section className="citizen-block-section">
            <div className="citizen-block-head">
              <h3 className="citizen-block-title">REQUEST ASSISTANCE</h3>
              <span className="citizen-block-count">4 SERVICES</span>
            </div>

            <div className="citizen-services-2x2">
              <button
                type="button"
                className="citizen-service-btn"
                onClick={() => handleQuickService('severe')}
              >
                <div className="citizen-service-icon-circle">
                  <Icon name="waves" size={20} />
                </div>
                <div className="citizen-service-info">
                  <span className="citizen-service-title">Flood Rescue</span>
                  <span className="citizen-service-meta">BOAT TEAM</span>
                </div>
              </button>

              <button
                type="button"
                className="citizen-service-btn"
                onClick={() => handleQuickService('moderate')}
              >
                <div className="citizen-service-icon-circle">
                  <Icon name="truck" size={20} />
                </div>
                <div className="citizen-service-info">
                  <span className="citizen-service-title">Evacuation</span>
                  <span className="citizen-service-meta">TRANSPORT</span>
                </div>
              </button>

              <button
                type="button"
                className="citizen-service-btn"
                onClick={() => handleQuickService('high', true)}
              >
                <div className="citizen-service-icon-circle">
                  <Icon name="aid" size={20} />
                </div>
                <div className="citizen-service-info">
                  <span className="citizen-service-title">Medical Aid</span>
                  <span className="citizen-service-meta">FIRST RESPONSE</span>
                </div>
              </button>

              <button
                type="button"
                className="citizen-service-btn"
                onClick={() => handleQuickService('low-moderate')}
              >
                <div className="citizen-service-icon-circle">
                  <Icon name="droplet" size={20} />
                </div>
                <div className="citizen-service-info">
                  <span className="citizen-service-title">Relief Goods</span>
                  <span className="citizen-service-meta">WATER / FOOD</span>
                </div>
              </button>
            </div>
          </section>

          {/* 4. Section: NEAREST RESPONDERS */}
          <section className="citizen-block-section">
            <div className="citizen-block-head">
              <h3 className="citizen-block-title">NEAREST RESPONDERS</h3>
              <button
                type="button"
                className="citizen-block-link"
                onClick={() => onNavigateTab?.('map')}
              >
                <span>Hazard map</span>
                <Icon name="arrow-up-right" size={13} />
              </button>
            </div>

            <div className="citizen-responders-stack">
              <div className="citizen-responder-row">
                <div className="citizen-responder-left">
                  <div className="citizen-responder-icon-circle">
                    <Icon name="map-fold" size={18} />
                  </div>
                  <div className="citizen-responder-info">
                    <span className="citizen-responder-heading">Rescue Team Alpha</span>
                    <span className="citizen-responder-distance font-mono">1.2 KM AWAY</span>
                  </div>
                </div>
                <div className="citizen-eta-pill citizen-eta-pill--green font-mono">
                  <span className="citizen-eta-dot" />
                  <span>ETA 6 min</span>
                </div>
              </div>

              <div className="citizen-responder-row">
                <div className="citizen-responder-left">
                  <div className="citizen-responder-icon-circle">
                    <Icon name="boat" size={18} />
                  </div>
                  <div className="citizen-responder-info">
                    <span className="citizen-responder-heading">Coast Guard Boat 4</span>
                    <span className="citizen-responder-distance font-mono">3.4 KM AWAY</span>
                  </div>
                </div>
                <div className="citizen-eta-pill citizen-eta-pill--blue font-mono">
                  <span className="citizen-eta-dot" />
                  <span>ETA 11 min</span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Section: LIVE ALERTS */}
          <section className="citizen-block-section">
            <div className="citizen-block-head">
              <h3 className="citizen-block-title">LIVE ALERTS</h3>
              <span className="citizen-block-count">AUTO-UPDATING</span>
            </div>

            <div className="citizen-alerts-stack">
              <div
                className="citizen-alert-box"
                role="button"
                tabIndex={0}
                onClick={() => onNavigateTab?.('inquiries')}
              >
                <div className="citizen-alert-top-row">
                  <span className="citizen-alert-type-pill citizen-alert-type-pill--critical">
                    <span className="citizen-alert-dot" />
                    <span>Critical</span>
                  </span>
                  <span className="citizen-alert-time-tag font-mono">2 MIN AGO</span>
                </div>
                <div className="citizen-alert-content-row">
                  <span className="citizen-alert-icon-wrap citizen-alert-icon-wrap--critical">
                    <Icon name="warning" size={18} />
                  </span>
                  <div className="citizen-alert-text-block">
                    <h4 className="citizen-alert-title">Marikina River past 2nd alarm</h4>
                    <p className="citizen-alert-desc">Barangay Tumana · rising 0.4 m/hr</p>
                  </div>
                </div>
              </div>

              <div
                className="citizen-alert-box"
                role="button"
                tabIndex={0}
                onClick={() => onNavigateTab?.('inquiries')}
              >
                <div className="citizen-alert-top-row">
                  <span className="citizen-alert-type-pill citizen-alert-type-pill--warning">
                    <span className="citizen-alert-dot" />
                    <span>Warning</span>
                  </span>
                  <span className="citizen-alert-time-tag font-mono">18 MIN AGO</span>
                </div>
                <div className="citizen-alert-content-row">
                  <span className="citizen-alert-icon-wrap citizen-alert-icon-wrap--warning">
                    <Icon name="broadcast" size={18} />
                  </span>
                  <div className="citizen-alert-text-block">
                    <h4 className="citizen-alert-title">Typhoon Signal No. 2 raised</h4>
                    <p className="citizen-alert-desc">Metro Manila · sustained 95 km/h</p>
                  </div>
                </div>
              </div>

              <div
                className="citizen-alert-box"
                role="button"
                tabIndex={0}
                onClick={() => onNavigateTab?.('inquiries')}
              >
                <div className="citizen-alert-top-row">
                  <span className="citizen-alert-type-pill citizen-alert-type-pill--advisory">
                    <span className="citizen-alert-dot" />
                    <span>Advisory</span>
                  </span>
                  <span className="citizen-alert-time-tag font-mono">41 MIN AGO</span>
                </div>
                <div className="citizen-alert-content-row">
                  <span className="citizen-alert-icon-wrap citizen-alert-icon-wrap--advisory">
                    <Icon name="bell" size={18} />
                  </span>
                  <div className="citizen-alert-text-block">
                    <h4 className="citizen-alert-title">Evacuation center at 70% capacity</h4>
                    <p className="citizen-alert-desc">Concepcion Elementary School</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Volunteer Hazard Reporting shortcut */}
          <div className="citizen-volunteer-footer-action">
            <Button
              variant="outline"
              size="lg"
              className="citizen-volunteer-btn"
              onClick={() => setShowHazardModal(true)}
            >
              <Icon name="report" size={18} />
              <span>REPORT LOCAL HAZARD (VOLUNTEER)</span>
            </Button>
          </div>
        </div>
      )}

      {/* ── INQUIRIES ────────────────────────────────────────────────────── */}
      {navSection === 'inquiries' && (
        <>
          <div className="action-buttons-hero">
            <Button
              variant="primary"
              size="lg"
              className="btn-danger-emergency"
              onClick={handleStartRequest}
            >
              <Icon name="alert" size={20} />
              <span>REQUEST EMERGENCY RESCUE</span>
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowHotlinesModal(true)}>
              <Icon name="phone" size={18} />
              <span>Emergency Hotlines (911 / 143)</span>
            </Button>
          </div>

          {activeReq ? (
            <Section
              title={`Active Rescue Tracking: ${activeReq.id}`}
              subtitle="Real-time multi-stage status and automated flood-aware tracking."
              action={
                activeReq.status === 'pending' ? (
                  <div className="tracking-top-actions">
                    <button
                      type="button"
                      className="link-btn text-danger"
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel request
                    </button>
                  </div>
                ) : null
              }
            >
              <div className="tracking-card">
                <div className="tracking-stepper">
                  {[
                    { stage: 'pending', num: '1', title: 'Pending Dispatch' },
                    { stage: 'assigned', num: '2', title: 'Rescuer Assigned' },
                    { stage: 'en-route', num: '3', title: 'En Route' },
                    { stage: 'arrived', num: '4', title: 'Arrived at Area' },
                    { stage: 'completed', num: '5', title: 'Rescued' },
                  ].map((s, idx) => {
                    const stages = ['pending', 'assigned', 'en-route', 'arrived', 'completed']
                    const currentIdx = stages.indexOf(activeReq.status)
                    const isPast = idx <= currentIdx
                    const isCurrent = activeReq.status === s.stage
                    return (
                      <div
                        key={s.stage}
                        className={`step-item ${isPast ? 'is-past' : ''} ${isCurrent ? 'is-current' : ''}`}
                      >
                        <div className="step-circle">
                          {isPast && !isCurrent ? <Icon name="check" size={13} /> : s.num}
                        </div>
                        <span className="step-title">{s.title}</span>
                      </div>
                    )
                  })}
                </div>

                {activeReq.status === 'pending' && (
                  <div className="tracking-detail-box stage-pending-box">
                    <div className="stage-head">
                      <span className="stage-icon-pulse"><Icon name="alert" size={22} /></span>
                      <div>
                        <h4>Stage 1: Pending Dispatcher Review</h4>
                        <p>A coordinator is reviewing your situation and checking flood route safety. Stay calm and move to higher ground if water is rising.</p>
                      </div>
                    </div>
                    <div className="stage-actions">
                      <Button variant="outline" onClick={() => setShowHotlinesModal(true)}>
                        <Icon name="phone" size={16} /> Call Emergency Hotlines (911 / 143)
                      </Button>
                    </div>
                  </div>
                )}

                {activeReq.status === 'assigned' && (
                  <div className="tracking-detail-box stage-assigned-box">
                    <div className="stage-head">
                      <span className="stage-icon-ok"><Icon name="volunteers" size={22} /></span>
                      <div>
                        <h4>Stage 2: Rescue Unit Assigned!</h4>
                        <p><strong>{activeReq.assignedTeamName || 'Team Alpha (Rubber Boat Unit)'}</strong> has been dispatched to your coordinates.</p>
                      </div>
                    </div>
                    <div className="team-callout-card">
                      <div className="team-callout-item">
                        <span className="callout-label">Assigned Unit</span>
                        <span className="callout-value">{activeReq.assignedTeamName} ({activeReq.rescuerCount || 4} Rescuers)</span>
                      </div>
                      <div className="team-callout-item">
                        <span className="callout-label">Medical Support</span>
                        <span className="callout-value">{activeReq.hasMedicalUnit ? '🩺 Flood Paramedic Unit Attached' : 'Standard First-Aid Kit'}</span>
                      </div>
                      <div className="team-callout-item">
                        <span className="callout-label">Direct Contact</span>
                        <span className="callout-value font-mono">+63 918 123 4567 (Capt. Santos)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeReq.status === 'en-route' && (
                  <div className="tracking-detail-box stage-enroute-box">
                    <div className="stage-head">
                      <span className="stage-icon-brand"><Icon name="boat" size={22} /></span>
                      <div>
                        <h4>Stage 3: Rescuers En Route — Live Telemetry</h4>
                        <p>The rescue craft is navigating safely along <strong>{activeMission?.activeRouteName || 'Jhocson St. Safe Corridor'}</strong>, successfully avoiding the impassable flood on Loyola St.</p>
                      </div>
                    </div>
                    <div className="enroute-reroute-explanation-card">
                      <div className="reroute-header">
                        <span className="live-indicator-dot" />
                        <span className="reroute-title">REAL-TIME ROUTE & DELAY ADVISORY</span>
                        <span className="reroute-source">Central Dispatch & Routing Engine</span>
                      </div>
                      <p className="reroute-message">"{currentRouteExplanation}"</p>
                      <div className="reroute-eta-row">
                        <span>⏱️ Current Arrival Target: <strong>{currentEtaMinutes} minutes</strong></span>
                        <span>🛣️ Corridor: <strong>{activeMission?.activeRouteName || 'Jhocson St. Safe Corridor'}</strong></span>
                      </div>
                    </div>
                    {activeMission?.liveStatusUpdates && activeMission.liveStatusUpdates.length > 0 && (
                      <div className="live-updates-timeline">
                        <span className="timeline-title">Live Dispatch Log</span>
                        <ul className="timeline-list">
                          {activeMission.liveStatusUpdates.slice(0, 3).map((upd) => (
                            <li key={upd.id} className="timeline-item">
                              <span className="upd-time font-mono">{upd.time}</span>
                              <span className="upd-author">[{upd.author}]</span>
                              <span className="upd-msg">{upd.message}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeReq.status === 'arrived' && (
                  <div className="tracking-detail-box stage-arrived-box">
                    <div className="stage-head">
                      <span className="stage-icon-arrived"><Icon name="pin" size={22} /></span>
                      <div>
                        <h4>Stage 4: Rescuers Have Arrived at Your Location!</h4>
                        <p>{activeReq.assignedTeamName || 'Team Alpha'} is now outside your address ({activeReq.location.address}). Please wave a flashlight or bright cloth to signal from the 2nd floor or roof.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeReq.status === 'completed' && (
                  <div className="tracking-detail-box stage-completed-box">
                    <div className="stage-head">
                      <span className="stage-icon-ok"><Icon name="check" size={22} /></span>
                      <div>
                        <h4>Stage 5: Rescue Completed Successfully</h4>
                        <p>All affected residents have been safely evacuated to <strong>Sampaloc Evacuation Center (NU Gymnasium)</strong>.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="tracking-info-grid">
                  <div>
                    <span className="info-label">Rescue Location</span>
                    <span className="info-val">{activeReq.location.address}</span>
                    {activeReq.location.landmark && (
                      <span className="info-sub">Landmark: {activeReq.location.landmark}</span>
                    )}
                  </div>
                  <div>
                    <span className="info-label">Headcount & Needs</span>
                    <span className="info-val">👤 {activeReq.headcount} people</span>
                    <VulnerabilitiesBadges vulns={activeReq.vulnerabilities} />
                  </div>
                  <div>
                    <span className="info-label">Flood Severity Reported</span>
                    <span className="info-val">{activeReq.floodDepth}</span>
                    <span className="info-sub">Severity Tier: {activeReq.severity.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="info-label">Medical Alerts</span>
                    <span className="info-val" style={{ color: activeReq.medicalNeeds ? 'var(--color-danger-text)' : 'inherit' }}>
                      {activeReq.medicalNeeds ? '🚨 Active Medical Need Flagged' : 'No emergency medical needs'}
                    </span>
                    {activeReq.medicalDetails && (
                      <span className="info-sub">{activeReq.medicalDetails}</span>
                    )}
                  </div>
                </div>
              </div>
            </Section>
          ) : (
            <Section title="Rescue Requests" subtitle="No active rescue request. Submit a new one if you need emergency assistance.">
              <div className="empty-state">
                <Icon name="alert" size={36} />
                <p>You have no active rescue request. Tap "Request Emergency Rescue" above if you need help.</p>
              </div>
            </Section>
          )}
        </>
      )}

      {/* ── HAZARD MAP ───────────────────────────────────────────────────── */}
      {navSection === 'map' && (
        <Section
          title="Flood-Aware Rescue Map"
          subtitle="Live visualization of active mission route, impassable water depths, and approaching rescue boat."
        >
          <InteractiveFloodMap
            activeStage={activeReq ? (activeReq.status as any) : 'en-route'}
            showAlternatives
            selectedRoute="primary"
            routeExplanation={currentRouteExplanation}
            etaMinutes={currentEtaMinutes}
          />
          <div className="hazard-map__preparedness">
            <EmergencyPreparednessGuide />
          </div>
        </Section>
      )}

      {/* ── MODALS (always mounted so state is preserved) ────────────────── */}
      <Modal
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        title="Emergency Rescue Request"
        subtitle="Dynamic severity-adaptive triage for Metro Manila flood rescue."
        maxWidth="620px"
      >
          <div className="adaptive-form-container">
          {locationError ? <p className="location-error" role="alert">{locationError}</p> : null}
          {/* Step Progress Bar */}
          <div className="form-wizard-header">
            <span className="wizard-step-tag">
              Step {currentStepIndex + 1} of {isBranch3 ? 2 : isBranch2 ? 3 : 5}
            </span>
            <span className="wizard-branch-tag">
              {currentStepIndex === 0
                ? 'Severity Triage'
                : isBranch3
                  ? 'Branch 3: Fast-Track High/Severe'
                  : isBranch2
                    ? 'Branch 2: Moderate Triage'
                    : 'Branch 1: Detailed Low/Moderate'}
            </span>
          </div>

          {/* STEP A — Severity Triage (Always First) */}
          {currentStepIndex === 0 && (
            <div className="wizard-step-content">
              <label className="field-group-title">
                Step A — How severe is the flooding at your location?
              </label>
              <p className="field-group-desc">
                Your selection automatically adapts the form so critical emergencies are dispatched instantly.
              </p>

              <div className="severity-selector-grid">
                {(
                  [
                    'low',
                    'low-moderate',
                    'moderate',
                    'high',
                    'severe',
                  ] as SeverityLevel[]
                ).map((s) => {
                  const cfg = SEVERITY_CONFIG[s]
                  const isSelected = stepA_severity === s
                  return (
                    <button
                      key={s}
                      type="button"
                      className={`severity-select-card ${cfg.className} ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setStepA_severity(s)}
                    >
                      <span className="sev-card-label">{cfg.label}</span>
                      <span className="sev-card-depth">{cfg.depth}</span>
                      <span className="sev-card-desc">{cfg.description}</span>
                    </button>
                  )
                })}
              </div>

              <div className="wizard-actions">
                <Button variant="ghost" onClick={() => setShowRequestForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setCurrentStepIndex(1)}>
                  Continue to Step B →
                </Button>
              </div>
            </div>
          )}

          {/* BRANCH 3 — HIGH TO SEVERE: Single Step Location with Auto-Pulled Profile */}
          {currentStepIndex === 1 && isBranch3 && (
            <div className="wizard-step-content">
              <div className="fast-track-banner">
                <Icon name="shield" size={20} />
                <div>
                  <strong>⚡ FAST-TRACK EMERGENCY RESCUE ACTIVATED</strong>
                  <p>
                    Because severity is <strong>{stepA_severity.toUpperCase()}</strong>, headcount (4),
                    vulnerabilities (Infant & Senior), and medical needs are auto-attached from your verified
                    saved response profile.
                  </p>
                </div>
              </div>

              <div className="field">
                <label className="field__label">Step B — Confirm Your Location</label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => { setLocationAddress(e.target.value); setLocationError('') }}
                  placeholder="Enter the current rescue location"
                />
              </div>

              <Button variant="ghost" onClick={handleUseGPS}>
                <Icon name="pin" size={16} /> Use GPS Location (14.6042° N, 120.9946° E)
              </Button>

              <div className="auto-pulled-preview-box">
                <span className="preview-heading">Auto-Attached Citizen Profile Data:</span>
                <ul className="preview-list">
                  <li>👤 <strong>Headcount:</strong> 4 persons (1 Infant, 1 Senior Citizen)</li>
                  <li>🚨 <strong>Medical Needs:</strong> Asthma nebulizer & cardiac medication</li>
                  <li>🏠 <strong>Landmark:</strong> Near NU Gate 2, 2-storey blue gate house</li>
                </ul>
              </div>

              <div className="wizard-actions">
                <Button variant="ghost" onClick={() => setCurrentStepIndex(0)}>
                  ← Back to Triage
                </Button>
                <Button
                  variant="primary"
                  className="btn-danger-emergency"
                  onClick={handleSubmitRequest}
                >
                  ⚡ SUBMIT EMERGENCY RESCUE REQUEST
                </Button>
              </div>
            </div>
          )}

          {/* BRANCH 2 — MODERATE: Location + Headcount/Medical */}
          {currentStepIndex === 1 && isBranch2 && (
            <div className="wizard-step-content">
              <div className="field">
                <label className="field__label">Step B — Location</label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => { setLocationAddress(e.target.value); setLocationError('') }}
                  placeholder="Street, barangay, or nearest landmark"
                />
              </div>

              <Button variant="ghost" onClick={handleUseGPS}>
                <Icon name="pin" size={16} /> Use GPS Location
              </Button>

              <div className="wizard-actions">
                <Button variant="ghost" onClick={() => setCurrentStepIndex(0)}>
                  ← Back
                </Button>
                <Button variant="primary" onClick={() => setCurrentStepIndex(2)}>
                  Next: Headcount & Medical →
                </Button>
              </div>
            </div>
          )}

          {currentStepIndex === 2 && isBranch2 && (
            <div className="wizard-step-content">
              <label className="field-group-title">Step C — Headcount & Medical Needs</label>

              <div className="field">
                <label className="field__label">Total Number of People Needing Rescue</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={headcount}
                  onChange={(e) => setHeadcount(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="field__label">Does anyone have urgent medical needs or injuries?</label>
                <div className="radio-group-row">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="medNeeds"
                      checked={hasMedical}
                      onChange={() => setHasMedical(true)}
                    />
                    <span>Yes, medical unit needed</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="medNeeds"
                      checked={!hasMedical}
                      onChange={() => setHasMedical(false)}
                    />
                    <span>No medical emergency</span>
                  </label>
                </div>
              </div>

              <div className="wizard-actions">
                <Button variant="ghost" onClick={() => setCurrentStepIndex(1)}>
                  ← Back
                </Button>
                <Button variant="primary" onClick={handleSubmitRequest}>
                  SUBMIT RESCUE REQUEST
                </Button>
              </div>
            </div>
          )}

          {/* BRANCH 1 — LOW TO LOW-MODERATE: Detailed Steps */}
          {currentStepIndex === 1 && isBranch1 && (
            <div className="wizard-step-content">
              <div className="field">
                <label className="field__label">Step B — Location</label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => { setLocationAddress(e.target.value); setLocationError('') }}
                  placeholder="Enter the current rescue location"
                />
              </div>

              <Button variant="ghost" onClick={handleUseGPS}>
                <Icon name="pin" size={16} /> Use GPS Location
              </Button>

              <div className="wizard-actions">
                <Button variant="ghost" onClick={() => setCurrentStepIndex(0)}>
                  ← Back
                </Button>
                <Button variant="primary" onClick={() => setCurrentStepIndex(2)}>
                  Next: Headcount & Vulnerabilities →
                </Button>
              </div>
            </div>
          )}

          {currentStepIndex === 2 && isBranch1 && (
            <div className="wizard-step-content">
              <label className="field-group-title">Step C — Headcount & Vulnerabilities</label>

              <div className="field">
                <label className="field__label">Total Headcount</label>
                <input
                  type="number"
                  min="1"
                  value={headcount}
                  onChange={(e) => setHeadcount(e.target.value)}
                />
              </div>

              <div className="field">
                <span className="field__label">Select Vulnerabilities Present</span>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={vulnerabilities.infant}
                      onChange={(e) =>
                        setVulnerabilities((v) => ({ ...v, infant: e.target.checked }))
                      }
                    />
                    <span>🍼 Infant / Toddler</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={vulnerabilities.senior}
                      onChange={(e) =>
                        setVulnerabilities((v) => ({ ...v, senior: e.target.checked }))
                      }
                    />
                    <span>👵 Senior Citizen</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={vulnerabilities.pwd}
                      onChange={(e) =>
                        setVulnerabilities((v) => ({ ...v, pwd: e.target.checked }))
                      }
                    />
                    <span>♿ Person with Disability (PWD)</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={vulnerabilities.pregnant}
                      onChange={(e) =>
                        setVulnerabilities((v) => ({ ...v, pregnant: e.target.checked }))
                      }
                    />
                    <span>🤰 Pregnant Woman</span>
                  </label>
                </div>
              </div>

              <div className="wizard-actions">
                <Button variant="ghost" onClick={() => setCurrentStepIndex(1)}>
                  ← Back
                </Button>
                <Button variant="primary" onClick={() => setCurrentStepIndex(3)}>
                  Next: Medical & Flood Depth →
                </Button>
              </div>
            </div>
          )}

          {currentStepIndex === 3 && isBranch1 && (
            <div className="wizard-step-content">
              <label className="field-group-title">Step D — Medical & Injury Details</label>

              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={hasMedical}
                  onChange={(e) => setHasMedical(e.target.checked)}
                />
                <span className="field__label">Immediate medical attention or medication required</span>
              </label>

              {hasMedical && (
                <div className="field">
                  <label className="field__label">Medical Condition / Injuries</label>
                  <textarea
                    rows={2}
                    placeholder="E.g., Asthma attack, laceration, wheelchair bound..."
                    value={medicalDetails}
                    onChange={(e) => setMedicalDetails(e.target.value)}
                  />
                </div>
              )}

              <div className="field">
                <label className="field__label">Confirm Observed Flood Depth at Scene</label>
                <select
                  value={sceneFloodDepth}
                  onChange={(e) => setSceneFloodDepth(e.target.value)}
                  className="form-select"
                >
                  <option value="Ankle-deep (0.1m - 0.2m)">Ankle-deep (0.1m - 0.2m)</option>
                  <option value="Knee-deep (0.2m - 0.4m)">Knee-deep (0.2m - 0.4m)</option>
                  <option value="Waist-deep (0.5m - 0.9m)">Waist-deep (0.5m - 0.9m)</option>
                  <option value="Chest-deep (1.0m - 1.4m)">Chest-deep (1.0m - 1.4m)</option>
                </select>
              </div>

              <div className="wizard-actions">
                <Button variant="ghost" onClick={() => setCurrentStepIndex(2)}>
                  ← Back
                </Button>
                <Button variant="primary" onClick={() => setCurrentStepIndex(4)}>
                  Next: Verification & Photo →
                </Button>
              </div>
            </div>
          )}

          {currentStepIndex === 4 && isBranch1 && (
            <div className="wizard-step-content">
              <label className="field-group-title">Step E — Verification & Submission</label>

              <div className="field">
                <span className="field__label">Optional: Attach Photo of Flooding / Surroundings</span>
                <div className="photo-upload-zone" onClick={() => setPhotoAttached((v) => !v)}>
                  <Icon name="camera" size={24} />
                  <span>
                    {photoAttached
                      ? '✓ Photo attached: flood_surroundings.jpg (Tap to remove)'
                      : 'Tap to simulate photo upload from camera/gallery'}
                  </span>
                </div>
              </div>

              <div className="request-summary-card">
                <h5>Summary of Rescue Request</h5>
                <p><strong>Location:</strong> {locationAddress}</p>
                <p><strong>Severity:</strong> {stepA_severity.toUpperCase()} ({sceneFloodDepth})</p>
                <p><strong>People:</strong> {headcount} ({Object.entries(vulnerabilities).filter(([, v]) => v).map(([k]) => k).join(', ') || 'No vulnerabilities'})</p>
                <p><strong>Medical:</strong> {hasMedical ? medicalDetails || 'Yes' : 'None'}</p>
              </div>

              <div className="wizard-actions">
                <Button variant="ghost" onClick={() => setCurrentStepIndex(3)}>
                  ← Back
                </Button>
                <Button variant="primary" onClick={handleSubmitRequest}>
                  SUBMIT RESCUE REQUEST
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* 4. VOLUNTEER HAZARD REPORTING MODAL (SIDE FLOW) */}
      <Modal
        isOpen={showHazardModal}
        onClose={() => setShowHazardModal(false)}
        title="Report Local Hazard"
        subtitle="Crowdsource real-time flood barriers to update the routing engine."
      >
        <form onSubmit={handleHazardSubmit} className="hazard-form">
          <div className="field">
            <label className="field__label">Location on Map / Street Name</label>
            <input
              type="text"
              required
              value={hazardLocation}
              onChange={(e) => setHazardLocation(e.target.value)}
              placeholder="E.g., Loyola St. cor. Dalupan"
            />
          </div>

          <div className="field">
            <label className="field__label">Hazard Type</label>
            <select
              value={hazardType}
              onChange={(e) => setHazardType(e.target.value as any)}
              className="form-select"
            >
              <option value="Impassable Flood">Impassable Flood</option>
              <option value="Blocked Road">Blocked Road (Fallen Tree / Debris)</option>
              <option value="Submerged Obstacle">Submerged Obstacle / Open Manhole</option>
              <option value="Live Electrical Wire">Live Electrical Wire</option>
            </select>
          </div>

          <div className="field">
            <label className="field__label">Flood Severity Level</label>
            <select
              value={hazardSeverity}
              onChange={(e) => setHazardSeverity(e.target.value as any)}
              className="form-select"
            >
              <option value="low">Low (Ankle-deep)</option>
              <option value="low-moderate">Low-Moderate (Knee-deep)</option>
              <option value="moderate">Moderate (Waist-deep)</option>
              <option value="high">High (Chest-deep)</option>
              <option value="severe">Severe (Overhead / Impassable)</option>
            </select>
          </div>

          <div className="field">
            <span className="field__label">Optional: Attach Hazard Photo</span>
            <button
              type="button"
              className={`photo-upload-zone ${hazardPhoto ? 'is-attached' : ''}`}
              onClick={() => setHazardPhoto((v) => !v)}
            >
              <Icon name="camera" size={20} />
              <span>{hazardPhoto ? '✓ Hazard Photo Attached' : 'Attach Photo of Hazard'}</span>
            </button>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: 12 }}>
            <Button variant="ghost" type="button" onClick={() => setShowHazardModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              SUBMIT HAZARD REPORT
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Request Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Rescue Request?"
        subtitle="Confirm if you no longer require emergency dispatch."
      >
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Cancelling will notify dispatch that you are in a safe location. If flood waters are still
          rising, keep your request active.
        </p>
        <div className="modal-footer" style={{ padding: 0, marginTop: 16 }}>
          <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
            Keep Request Active
          </Button>
          <Button
            variant="primary"
            className="btn-danger-emergency"
            onClick={() => {
              if (activeReq) updateRequestStatus(activeReq.id, 'cancelled')
              setShowCancelModal(false)
            }}
          >
            Yes, Cancel Request
          </Button>
        </div>
      </Modal>

      {/* Hotlines Modal */}
      <EmergencyHotlinesModal
        isOpen={showHotlinesModal}
        onClose={() => setShowHotlinesModal(false)}
      />
    </div>
  )
}
