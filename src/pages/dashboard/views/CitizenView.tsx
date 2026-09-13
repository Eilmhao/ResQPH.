import { useState } from 'react'
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
  LocalizedForecastWidget,
  SEVERITY_CONFIG,
} from './shared'
import type { NavSection } from './navTypes'

export function CitizenView({
  navSection = 'overview',
  onNavigateTab,
}: {
  navSection?: NavSection
  onNavigateTab?: (section: NavSection) => void
}) {
  const {
    activeCitizenRequest,
    missions,
    createRescueRequest,
  } = useMissions()

  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showHotlinesModal, setShowHotlinesModal] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const [stepA_severity] = useState<SeverityLevel>('moderate')
  const [locationAddress, setLocationAddress] = useState('Brgy. Tumana, Marikina City')
  const [locationError, setLocationError] = useState('')

  const activeReq = activeCitizenRequest
  const activeMission = missions.find((m) => m.requestId === activeReq?.id) || missions[0]
  const currentRouteExplanation =
    activeMission?.routeDelayExplanation ||
    'Rescue Team arrival: 6 minutes. Primary route via Tumana Bridge.'
  const currentEtaMinutes = activeMission?.etaMinutes || 6

  function handleStartRequest(serviceName?: string) {
    if (serviceName) setSelectedService(serviceName)
    setShowRequestForm(true)
    setLocationError('')
  }

  function handleSubmitRequest() {
    if (!locationAddress.trim()) {
      setLocationError('Add current location before submitting.')
      return
    }

    createRescueRequest({
      citizenName: SAVED_CITIZEN_PROFILE.name,
      citizenPhone: SAVED_CITIZEN_PROFILE.phone,
      severity: stepA_severity,
      branchTaken: 3,
      location: {
        address: locationAddress.trim(),
        coordinates: [121.0912, 14.6532],
      },
      headcount: SAVED_CITIZEN_PROFILE.headcount,
      vulnerabilities: SAVED_CITIZEN_PROFILE.vulnerabilities,
      medicalNeeds: selectedService === 'Medical Aid',
      floodDepth: SEVERITY_CONFIG[stepA_severity].depth,
      isAutoPulledProfile: true,
    })

    setShowRequestForm(false)
  }

  return (
    <div className="resq-citizen-wrapper">
      <main className="resq-citizen-workspace">
        <div className="citizen-dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem' }}>
          
          {/* WEATHER FORECAST */}
          <LocalizedForecastWidget />

          {/* ================= OVERVIEW TAB CONTENT ================= */}
          {navSection === 'overview' && (
            <div className="citizen-mockup-overview" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* 1. LOCATION BADGE */}
              <div className="neu-red-action-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(138, 3, 3, 0.1)', padding: '10px', borderRadius: '12px', color: '#8A0303' }}>
                    <Icon name="navigation" size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                      Brgy. Tumana, Marikina City
                    </h3>
                    <span className="font-mono" style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                      14.6532 N · 121.0912 E
                    </span>
                  </div>
                </div>

                <div style={{ padding: '0.4rem 0.85rem', background: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22, 163, 74, 0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>GPS Lock</span>
                </div>
              </div>

              {/* 2. MAIN SOS TRIGGER CARD */}
              <div className="neu-red-action-card" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', borderRadius: '24px' }}>
                
                {/* GLOWING EMERGENCY CHANNEL OPEN BADGE */}
                <div className="glowing-emergency-pill">
                  <span className="glowing-red-dot-live" />
                  <span>EMERGENCY CHANNEL OPEN</span>
                </div>

                {/* NEAT SIZED SOS BUTTON */}
                <button
                  type="button"
                  className="sos-button-neat"
                  onClick={() => handleStartRequest('Emergency SOS')}
                >
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '0.06em' }}>SOS</span>
                  <span style={{ fontSize: '0.58rem', fontWeight: 800, opacity: 0.9, letterSpacing: '0.04em' }}>HOLD TO SEND</span>
                </button>

                <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '420px', margin: 0, lineHeight: 1.4 }}>
                  Sends your location, household size, and hazard type to the nearest response unit.
                </p>

                <button
                  type="button"
                  style={{ background: '#ffffff', padding: '0.65rem 1.25rem', borderRadius: '14px', border: '1px solid #cbd5e1', color: '#1e293b', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '4px 4px 10px rgba(163, 177, 198, 0.4)' }}
                  onClick={() => setShowHotlinesModal(true)}
                >
                  <Icon name="phone" size={16} style={{ color: '#8A0303' }} />
                  <span>Call 911 hotline</span>
                </button>
              </div>

              {/* 3. REQUEST ASSISTANCE (4 SERVICES WITH CUSTOM ICONS) */}
              <div className="neu-red-action-card" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#8A0303', letterSpacing: '0.04em', margin: 0 }}>
                    REQUEST ASSISTANCE
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>4 SERVICES</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[
                    { name: 'Flood Rescue', tag: 'BOAT TEAM', icon: 'shield' },
                    { name: 'Evacuation', tag: 'TRANSPORT', icon: 'map-fold' },
                    { name: 'Medical Aid', tag: 'FIRST RESPONSE', icon: 'heart' },
                    { name: 'Relief Goods', tag: 'WATER / FOOD', icon: 'package' },
                  ].map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      className="neu-red-card"
                      style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '8px', borderRadius: '18px', cursor: 'pointer', textAlign: 'left', border: 'none' }}
                      onClick={() => handleStartRequest(service.name)}
                    >
                      <div style={{ background: 'rgba(255, 255, 255, 0.15)', width: '38px', height: '38px', borderRadius: '12px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={service.icon as any} size={18} />
                      </div>
                      <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>{service.name}</strong>
                      <span className="font-mono" style={{ fontSize: '0.68rem', fontWeight: 800, color: '#fca5a5' }}>{service.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. NEAREST RESPONDERS */}
              <div className="neu-red-action-card" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#8A0303', letterSpacing: '0.04em', margin: 0 }}>
                    NEAREST RESPONDERS
                  </h3>
                  <button
                    type="button"
                    style={{ border: 'none', background: 'transparent', color: '#8A0303', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => onNavigateTab?.('map')}
                  >
                    <span>Hazard map</span>
                    <Icon name="arrow-up-right" size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { name: 'Rescue Team Alpha', distance: '1.2 KM AWAY', eta: 'ETA 6 min', bg: '#D1FFBD', textColor: '#14532d' },
                    { name: 'Coast Guard Boat 4', distance: '3.4 KM AWAY', eta: 'ETA 11 min', bg: '#9DD1F1', textColor: '#1e3a8a' },
                  ].map((responder) => (
                    <div key={responder.name} className="neu-red-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderRadius: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '10px', borderRadius: '12px', color: '#ffffff' }}>
                          <Icon name="map-fold" size={20} />
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.95rem', color: '#ffffff' }}>{responder.name}</strong>
                          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 700 }}>{responder.distance}</span>
                        </div>
                      </div>

                      <div style={{ padding: '0.35rem 0.8rem', background: responder.bg, borderRadius: '12px' }}>
                        <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 800, color: responder.textColor }}>{responder.eta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. LIVE ALERTS */}
              <div className="neu-red-action-card" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#8A0303', letterSpacing: '0.04em', margin: 0 }}>
                    LIVE ALERTS
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>AUTO-UPDATING</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* CRITICAL ALERT */}
                  <div className="neu-red-card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '6px', borderRadius: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff', background: '#FF4500', padding: '3px 9px', borderRadius: '10px', textTransform: 'uppercase' }}>● Critical</span>
                      <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>2 MIN AGO</span>
                    </div>
                    <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>Marikina River past 2nd alarm</strong>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.9)' }}>Barangay Tumana · rising 0.4 m/hr</span>
                  </div>

                  {/* WARNING ALERT */}
                  <div className="neu-red-card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '6px', borderRadius: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1e293b', background: '#FFFF00', padding: '3px 9px', borderRadius: '10px', textTransform: 'uppercase' }}>● Warning</span>
                      <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>18 MIN AGO</span>
                    </div>
                    <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>Typhoon Signal No. 2 raised</strong>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.9)' }}>Metro Manila · sustained 95 km/h</span>
                  </div>

                  {/* ADVISORY ALERT */}
                  <div className="neu-red-card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '6px', borderRadius: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1e293b', background: '#D1FFBD', padding: '3px 9px', borderRadius: '10px', textTransform: 'uppercase' }}>● Advisory</span>
                      <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>41 MIN AGO</span>
                    </div>
                    <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>Evacuation center at 70% capacity</strong>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.9)' }}>Concepcion Elementary School</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= INQUIRIES TAB ================= */}
          {navSection === 'inquiries' && (
            <div style={{ width: '100%' }}>
              <Section title="Rescue Tracking" subtitle="Real-time status tracking for your rescue request.">
                {activeReq ? (
                  <div className="neu-red-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
                    <strong style={{ color: '#ffffff' }}>{activeReq.location.address}</strong>
                    <p style={{ color: 'rgba(255,255,255,0.9)' }}>Occupants: {activeReq.headcount}</p>
                  </div>
                ) : (
                  <div className="neu-red-card" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
                    <p style={{ color: '#ffffff', fontWeight: 700, margin: 0 }}>No active rescue requests.</p>
                  </div>
                )}
              </Section>
            </div>
          )}

          {/* ================= MAP TAB ================= */}
          {navSection === 'map' && (
            <div style={{ width: '100%' }}>
              <Section title="Flood-Aware Rescue Map" subtitle="Live visualization of active mission route and hazard updates.">
                <InteractiveFloodMap
                  activeStage={activeReq ? (activeReq.status as any) : 'en-route'}
                  showAlternatives
                  selectedRoute="primary"
                  routeExplanation={currentRouteExplanation}
                  etaMinutes={currentEtaMinutes}
                />
                <div className="hazard-map__preparedness" style={{ marginTop: '1rem' }}>
                  <EmergencyPreparednessGuide />
                </div>
              </Section>
            </div>
          )}

        </div>
      </main>

      {/* REQUEST MODAL */}
      <Modal
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        title={selectedService ? `Request ${selectedService}` : 'Emergency Rescue Request'}
        subtitle="Priority dispatch for flood-affected citizens."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {locationError && <p style={{ color: '#dc2626', fontSize: '0.85rem' }}>{locationError}</p>}
          <label className="field__label">Location Address</label>
          <input
            type="text"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
            <Button variant="ghost" onClick={() => setShowRequestForm(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmitRequest}>Submit Request</Button>
          </div>
        </div>
      </Modal>

      <EmergencyHotlinesModal
        isOpen={showHotlinesModal}
        onClose={() => setShowHotlinesModal(false)}
      />
    </div>
  )
}