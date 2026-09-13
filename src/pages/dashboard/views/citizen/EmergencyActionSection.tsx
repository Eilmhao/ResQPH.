import { useState } from 'react'
import { Icon } from '../../../../components/art/Icon'
import './EmergencyActionSection.css'

interface EmergencyActionSectionProps {
  mode?: 'citizen' | 'volunteer'
  onRequestRescue?: () => void
  onReportHazard?: () => void
}

export function EmergencyActionSection({
  mode = 'citizen',
  onRequestRescue,
  onReportHazard,
}: EmergencyActionSectionProps) {
  const [activeTab, setActiveTab] = useState<'primary' | 'hazard'>('primary')

  const isVolunteer = mode === 'volunteer'

  return (
    <div className="emergency-action-container neu-white-action-card">
      {/* HEADER TITLE */}
      <div className="action-header">
        <div className="action-title-group">
          <div className="action-icon-badge red-pulse">
            <Icon name="alert" size={20} />
          </div>
          <div>
            <h2 className="action-heading">
              {isVolunteer
                ? 'Active Citizen SOS Signals & Hazard Center'
                : 'Emergency Dispatch & Hazard Center'}
            </h2>
            {!isVolunteer && (
              <p className="action-subheading">
                Select an option below to initiate priority response or update ground situation logs.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ACTION SELECTOR BUTTONS GRID */}
      <div className="action-buttons-grid">
        {/* PRIMARY ACTION BUTTON */}
        <button
          type="button"
          className={`neu-action-btn primary-red ${activeTab === 'primary' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveTab('primary')
            onRequestRescue?.()
          }}
        >
          <div className="btn-icon-wrapper white-glow">
            <Icon name={isVolunteer ? 'map-fold' : 'shield'} size={24} />
          </div>
          <div className="btn-text-content">
            <span className="btn-title">
              {isVolunteer ? 'ACTIVE FIELD MISSIONS' : 'REQUEST EMERGENCY RESCUE'}
            </span>
            <span className="btn-desc">
              {isVolunteer
                ? 'Track live field units and ongoing citizen distress routes'
                : 'Priority triage dispatch for trapped or endangered citizens'}
            </span>
          </div>
          <Icon name="arrow-right" size={20} className="btn-arrow" />
        </button>

        {/* SECONDARY ACTION: REPORT LOCAL HAZARD */}
        <button
          type="button"
          className={`neu-action-btn secondary-red-outline ${activeTab === 'hazard' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveTab('hazard')
            onReportHazard?.()
          }}
        >
          <div className="btn-icon-wrapper red-soft-bg">
            <Icon name="pin" size={24} />
          </div>
          <div className="btn-text-content">
            <span className="btn-title">REPORT LOCAL HAZARD</span>
            <span className="btn-desc">Submit crowdsourced flood levels, blocked roads, or powerlines</span>
          </div>
          <Icon name="arrow-right" size={20} className="btn-arrow" />
        </button>
      </div>

      {/* FOOTER NOTE (CITIZEN MODE ONLY) */}
      {!isVolunteer && (
        <div className="action-footer-note neu-red-inset-box">
          <div className="note-left">
            <Icon name="clock" size={16} />
            <span>Average Response Time: <strong>8-12 Mins (Sampaloc Zone)</strong></span>
          </div>
          <span className="live-status-pill">● Dispatchers Online</span>
        </div>
      )}
    </div>
  )
}