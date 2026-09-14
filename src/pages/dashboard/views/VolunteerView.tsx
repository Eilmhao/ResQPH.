import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Icon } from '../../../components/art/Icon'
import { Modal } from '../../../components/ui/Modal'
import { useMissions } from '../../../features/missions/MissionContext'
import type { SeverityLevel } from '../../../features/missions/types'
import { InteractiveFloodMap } from '../../../features/map/InteractiveFloodMap'
import {
  EmergencyHotlinesModal,
  EmergencyPreparednessGuide,
  Section,
  VulnerabilitiesBadges,
  LocalizedForecastWidget,
  SEVERITY_CONFIG,
} from './shared'
import { EmergencyActionSection } from './citizen/EmergencyActionSection'
import type { NavSection } from './navTypes'

export function VolunteerView({
  navSection = 'overview',
  onNavigateTab,
}: {
  navSection?: NavSection
  onNavigateTab?: (section: NavSection) => void
}) {
  const {
    activeCitizenRequest,
    missions,
    submitHazardReport,
  } = useMissions()

  const [showHazardModal, setShowHazardModal] = useState(false)
  const [showHotlinesModal, setShowHotlinesModal] = useState(false)

  // Volunteer Hazard Form States
  const [hazardLocation, setHazardLocation] = useState('Loyola St. cor. Dalupan')
  const [hazardType, setHazardType] = useState<
    'Impassable Flood' | 'Blocked Road' | 'Submerged Obstacle' | 'Live Electrical Wire'
  >('Impassable Flood')
  const [hazardSeverity] = useState<SeverityLevel>('high')
  const [hazardSubmittedAlert, setHazardSubmittedAlert] = useState(false)

  function handleHazardSubmit(e: React.FormEvent) {
    e.preventDefault()
    submitHazardReport({
      reporterName: 'Field Volunteer',
      locationName: hazardLocation,
      coordinates: [120.9955, 14.6052],
      hazardType,
      severity: hazardSeverity,
      floodDepth: SEVERITY_CONFIG[hazardSeverity].depth,
    })
    setShowHazardModal(false)
    setHazardSubmittedAlert(true)
    setTimeout(() => setHazardSubmittedAlert(false), 5000)
  }

  const activeReq = activeCitizenRequest
  const activeMission = missions.find((m) => m.requestId === activeReq?.id) || missions[0]
  const currentRouteExplanation =
    activeMission?.routeDelayExplanation ||
    'Rescue Team arrival: 9 minutes. All possible shortcuts are flooded and team is using Jhocson St.'
  const currentEtaMinutes = activeMission?.etaMinutes || 9

  return (
    <div className="resq-citizen-wrapper">
      <main className="resq-citizen-workspace">
        <div
          className="citizen-dashboard"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem' }}
        >
          {/* ================= 1. OVERVIEW PAGE ================= */}
          {navSection === 'overview' && (
            <>
              {/* WEATHER FORECAST */}
              <LocalizedForecastWidget />

              {/* ACTION CENTER */}
              <EmergencyActionSection
                mode="volunteer"
                onRequestRescue={() => onNavigateTab?.('inquiries')}
                onReportHazard={() => setShowHazardModal(true)}
              />

              {hazardSubmittedAlert && (
                <div className="alert-banner-success" style={{ width: '100%' }}>
                  <Icon name="check" size={18} />
                  <span>
                    <strong>Hazard Report Logged!</strong> Central dispatch routing maps have been updated.
                  </span>
                </div>
              )}

              {/* VOLUNTEER STATION CARD */}
              <div style={{ width: '100%' }}>
                <div
                  className="neu-red-action-card"
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                  }}
                >
                  <div
                    className="neu-red-card"
                    style={{
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderRadius: '18px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          padding: '10px',
                          borderRadius: '12px',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon name="navigation" size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                          Volunteer Station: Sampaloc Zone
                        </h3>
                        <span
                          className="font-mono"
                          style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}
                        >
                          14.6042 N · 120.9946 E
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '0.4rem 0.85rem',
                        background: 'rgba(22, 163, 74, 0.2)',
                        border: '1px solid rgba(22, 163, 74, 0.4)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80' }} />
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: '#4ade80',
                          textTransform: 'uppercase',
                        }}
                      >
                        Field Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================= 2. TRACK SOS PAGE ================= */}
          {navSection === 'inquiries' && (
            <div style={{ width: '100%' }}>
              <div
                className="neu-red-action-card"
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                  <div
                    style={{
                      background: 'rgba(138, 3, 3, 0.1)',
                      padding: '10px',
                      borderRadius: '12px',
                      color: '#8A0303',
                    }}
                  >
                    <Icon name="alert" size={22} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8A0303', margin: 0 }}>
                      Active Citizen SOS Signals
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                      Live telemetry for verified citizen distress calls in Sampaloc.
                    </p>
                  </div>
                </div>

                {activeReq ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div className="neu-red-card" style={{ padding: '1rem', borderRadius: '16px' }}>
                      <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#fca5a5', textTransform: 'uppercase' }}>Target Location</span>
                      <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>{activeReq.location.address}</strong>
                    </div>

                    <div className="neu-red-card" style={{ padding: '1rem', borderRadius: '16px' }}>
                      <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#fca5a5', textTransform: 'uppercase' }}>Occupants & Priority</span>
                      <strong style={{ fontSize: '0.95rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                        <Icon name="user" size={14} /> {activeReq.headcount} citizens
                      </strong>
                      <VulnerabilitiesBadges vulns={activeReq.vulnerabilities} />
                    </div>
                  </div>
                ) : (
                  <div className="neu-red-card" style={{ padding: '2rem', textAlign: 'center', borderRadius: '16px' }}>
                    <Icon name="alert" size={36} style={{ color: '#ffffff', marginBottom: '8px' }} />
                    <p style={{ color: '#ffffff', fontWeight: 700, margin: 0 }}>No active SOS signals recorded in this district.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= 3. HAZARD MAP PAGE WITH FLOOD-AWARE RESCUE MAP ================= */}
          {navSection === 'map' && (
            <div style={{ width: '100%' }}>
              <Section
                title="Volunteer Hazard & Flood Navigation Map"
                subtitle="Field tracking of impassable roads and active rescue watercraft."
              >
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

      {/* HAZARD REPORT MODAL */}
      <Modal
        isOpen={showHazardModal}
        onClose={() => setShowHazardModal(false)}
        title="Submit Volunteer Hazard Report"
        subtitle="Log local street flooding or obstacle data."
      >
        <form onSubmit={handleHazardSubmit} className="hazard-form">
          <div className="field">
            <label className="field__label">Street Name / Landmark</label>
            <input
              type="text"
              required
              value={hazardLocation}
              onChange={(e) => setHazardLocation(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label className="field__label">Hazard Type</label>
            <select
              value={hazardType}
              onChange={(e) => setHazardType(e.target.value as any)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #cbd5e1' }}
            >
              <option value="Impassable Flood">Impassable Flood</option>
              <option value="Blocked Road">Blocked Road</option>
              <option value="Submerged Obstacle">Submerged Obstacle</option>
              <option value="Live Electrical Wire">Live Electrical Wire</option>
            </select>
          </div>
          <div className="modal-footer" style={{ padding: 0, marginTop: 16 }}>
            <Button variant="ghost" type="button" onClick={() => setShowHazardModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              SUBMIT FIELD REPORT
            </Button>
          </div>
        </form>
      </Modal>

      <EmergencyHotlinesModal
        isOpen={showHotlinesModal}
        onClose={() => setShowHotlinesModal(false)}
      />
    </div>
  )
}
