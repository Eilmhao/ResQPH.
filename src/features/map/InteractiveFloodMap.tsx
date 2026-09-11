import { useState } from 'react'
import { Icon } from '../../components/art/Icon'
import './map.css'

interface MapProps {
  activeStage?: 'pending' | 'assigned' | 'en-route' | 'arrived' | 'completed' | 'all'
  highlightStreet?: string
  showAlternatives?: boolean
  selectedRoute?: 'primary' | 'alternative' | 'override'
  onSelectRoute?: (route: 'primary' | 'alternative') => void
  routeExplanation?: string
  etaMinutes?: number
}

export function InteractiveFloodMap({
  activeStage = 'en-route',
  showAlternatives = true,
  selectedRoute = 'primary',
  onSelectRoute,
  routeExplanation = 'Rescue Team arrival: 9 minutes. All possible shortcuts are flooded and needs to head another alternative routes "Loyola St.".',
  etaMinutes = 9,
}: MapProps) {
  const [mapLayerMode, setMapLayerMode] = useState<'tactical' | 'satellite'>('tactical')
  const [showFloodDepthLayer, setShowFloodDepthLayer] = useState(true)
  const [showWaterways] = useState(true)
  const [showHazardPins] = useState(true)

  // Simulation position based on stage
  const vehicleProgress =
    activeStage === 'pending'
      ? 0.05
      : activeStage === 'assigned'
        ? 0.2
        : activeStage === 'en-route'
          ? 0.58
          : 0.95 // arrived or completed

  // Realistic Waypoints along España -> Jhocson safe corridor:
  // Base (120, 75) -> España Turn (240, 150) -> Jhocson Entry (380, 210) -> Citizen Target (540, 220)
  const boatX = 120 + (540 - 120) * vehicleProgress
  const boatY = 75 + (220 - 75) * vehicleProgress

  return (
    <div className="flood-map-container" role="region" aria-label="Interactive Realistic Flood-Aware Rescue Map">
      {/* Top Map HUD & Cartography Controls */}
      <div className="flood-map-controls">
        <div className="flood-map-legend-items">
          <span className="legend-tag legend-study">
            📍 Sampaloc, Manila GIS · 14.6042° N, 120.9946° E (WGS84)
          </span>
          <span className="legend-tag legend-safe">
            ● Safe Transit (Jhocson Corridor · {etaMinutes}m ETA)
          </span>
          <span className="legend-tag legend-impassable">
            ✕ Loyola St. (Impassable: 1.4m Depth)
          </span>
        </div>

        <div className="flood-map-toggles">
          <button
            type="button"
            className={`map-toggle-btn ${mapLayerMode === 'tactical' ? 'is-active' : ''}`}
            onClick={() => setMapLayerMode('tactical')}
          >
            Tactical GIS
          </button>
          <button
            type="button"
            className={`map-toggle-btn ${mapLayerMode === 'satellite' ? 'is-active' : ''}`}
            onClick={() => setMapLayerMode('satellite')}
          >
            Satellite View
          </button>
          <button
            type="button"
            className={`map-toggle-btn ${showFloodDepthLayer ? 'is-active' : ''}`}
            onClick={() => setShowFloodDepthLayer((v) => !v)}
          >
            NOAH Flood Depth: {showFloodDepthLayer ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Dynamic Real-Time Route Update Banner over the Map */}
      <div className="map-realtime-routing-banner">
        <div className="banner-pulse-icon">
          <Icon name="route" size={18} />
        </div>
        <div className="banner-text">
          <strong>EN ROUTE REAL-TIME TELEMETRY:</strong>{' '}
          <span>{routeExplanation}</span>
        </div>
        <span className="banner-eta-badge font-mono">ETA: {etaMinutes} MINS</span>
      </div>

      {/* SVG Vector Canvas with Realistic Cartography */}
      <div className={`flood-map-canvas ${mapLayerMode === 'satellite' ? 'canvas-satellite' : ''}`}>
        <svg viewBox="0 0 860 480" preserveAspectRatio="xMidYMid meet" className="flood-map-svg">
          <defs>
            {/* NOAH Hydrodynamic flood hazard zones */}
            <linearGradient id="floodHighDepth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#b91c1c" stopOpacity="0.68" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="floodMedDepth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="80%" stopColor="#d97706" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="floodLowDepth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.15" />
            </linearGradient>

            {/* Impassable cross-hatch pattern */}
            <pattern id="impassableCross" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="7" height="14" fill="#dc2626" />
              <rect x="7" width="7" height="14" fill="#180a0a" />
            </pattern>

            {/* Grid background texture */}
            <pattern id="gisGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Map Base Surface */}
          <rect width="860" height="480" fill={mapLayerMode === 'satellite' ? '#121614' : '#140c0c'} />
          <rect width="860" height="480" fill="url(#gisGrid)" />

          {/* Estero de Sampaloc & Natural Drainage Canals */}
          {showWaterways && (
            <g className="waterways-layer">
              <path
                d="M 60 460 Q 200 390 340 370 T 560 380 T 820 440"
                fill="none"
                stroke="#0284c7"
                strokeWidth="16"
                strokeOpacity="0.45"
                strokeLinecap="round"
              />
              <path
                d="M 60 460 Q 200 390 340 370 T 560 380 T 820 440"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeOpacity="0.8"
                strokeDasharray="8 6"
              />
              <text x="340" y="360" fill="#7dd3fc" fontSize="9" fontFamily="var(--font-mono)" opacity="0.85">
                ESTERO DE SAMPALOC (DRAINAGE CANAL · 2.35m WATER LEVEL CRITICAL)
              </text>
            </g>
          )}

          {/* Urban City Blocks & Realistic Building Footprints */}
          <g fill={mapLayerMode === 'satellite' ? '#1e2420' : '#1c1010'} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8">
            {/* UST Field & Campus Quad */}
            <rect x="40" y="35" width="170" height="95" rx="4" fill={mapLayerMode === 'satellite' ? '#172e20' : '#221414'} />
            <rect x="55" y="45" width="60" height="40" rx="2" fill="rgba(255,255,255,0.05)" />
            <rect x="125" y="45" width="70" height="70" rx="2" fill="rgba(96,165,250,0.08)" />

            {/* National University Campus Quad */}
            <rect x="255" y="35" width="190" height="95" rx="4" fill={mapLayerMode === 'satellite' ? '#1e2832' : '#261212'} />
            <rect x="270" y="45" width="75" height="50" rx="2" fill="rgba(239,68,68,0.12)" />
            <rect x="355" y="45" width="75" height="75" rx="2" fill="rgba(255,255,255,0.04)" />

            {/* Sampaloc Evacuation Center Complex (NU Gymnasium) */}
            <rect x="485" y="35" width="170" height="95" rx="4" fill="#13231a" stroke="#22c55e" strokeWidth="1" />
            <rect x="500" y="45" width="140" height="75" rx="3" fill="rgba(34,197,94,0.12)" />

            {/* Eastern Mixed Residential Blocks */}
            <rect x="695" y="35" width="130" height="95" rx="4" />

            {/* Central Residential Subdivisions (Between España & Loyola) */}
            <rect x="40" y="165" width="170" height="95" rx="3" />
            <rect x="255" y="165" width="190" height="95" rx="3" />
            <rect x="485" y="165" width="170" height="95" rx="3" />
            <rect x="695" y="165" width="130" height="95" rx="3" />

            {/* South District Blocks (Loyola - Earnshaw corridor) */}
            <rect x="40" y="295" width="170" height="95" rx="3" />
            <rect x="255" y="295" width="190" height="95" rx="3" />
            <rect x="485" y="295" width="170" height="95" rx="3" />
            <rect x="695" y="295" width="130" height="95" rx="3" />
          </g>

          {/* UP NOAH / LiPAD Flood Depth Inundation Contours */}
          {showFloodDepthLayer && (
            <g className="noah-flood-polygons">
              {/* Loyola Street Severe Inundation Zone (>1.5m) */}
              <path
                d="M 230 265 Q 380 230 520 255 Q 670 295 620 340 Q 460 360 310 345 Z"
                fill="url(#floodHighDepth)"
                stroke="#dc2626"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="360" y="315" fill="#fca5a5" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold">
                SEVERE FLOODING (WATER DEPTH: 1.40m – 1.85m)
              </text>

              {/* España Waist-Deep Overflow Basin (0.5m - 0.9m) */}
              <ellipse cx="320" cy="148" rx="220" ry="38" fill="url(#floodMedDepth)" />

              {/* Gutter / Low ponding zones */}
              <ellipse cx="690" cy="230" rx="90" ry="40" fill="url(#floodLowDepth)" />
            </g>
          )}

          {/* Road Network Primary Arterials & Corridors */}
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* ESPAÑA BOULEVARD (Major Multi-lane Arterial) */}
            <line x1="20" y1="145" x2="840" y2="145" stroke="#331c1c" strokeWidth="26" />
            <line x1="20" y1="145" x2="840" y2="145" stroke="#4a2525" strokeWidth="20" />
            <line x1="20" y1="145" x2="840" y2="145" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 8" opacity="0.6" />

            {/* LACSON AVENUE (Flyover & Arterial) */}
            <line x1="675" y1="20" x2="675" y2="460" stroke="#331c1c" strokeWidth="22" />
            <line x1="675" y1="20" x2="675" y2="460" stroke="#4a2525" strokeWidth="16" />

            {/* DALUPAN STREET */}
            <line x1="230" y1="20" x2="230" y2="460" stroke="#291515" strokeWidth="14" />

            {/* GERARDO STREET (Detour Route with Moderate Flood) */}
            <path
              d="M 230 145 L 465 145 L 465 220 L 540 220"
              fill="none"
              stroke="#291515"
              strokeWidth="14"
            />
            {showAlternatives && (
              <path
                d="M 230 145 L 465 145 L 465 220 L 540 220"
                fill="none"
                stroke={selectedRoute === 'alternative' ? '#f59e0b' : '#f59e0b88'}
                strokeWidth={selectedRoute === 'alternative' ? 6 : 4}
                strokeDasharray="6 4"
                className="route-detour-line"
                onClick={() => onSelectRoute?.('alternative')}
                style={{ cursor: 'pointer' }}
              />
            )}

            {/* LOYOLA STREET (BLOCKED / IMPASSABLE ROAD) */}
            <line x1="230" y1="280" x2="675" y2="280" stroke="#571111" strokeWidth="18" />
            <line x1="235" y1="280" x2="670" y2="280" stroke="url(#impassableCross)" strokeWidth="14" />

            {/* JHOCSON STREET (SAFE CORRIDOR RECOMMENDED) */}
            <path
              d="M 120 75 L 230 75 L 230 145 L 230 220 L 540 220"
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              className="route-safe-corridor"
              onClick={() => onSelectRoute?.('primary')}
              style={{ cursor: 'pointer' }}
            />
          </g>

          {/* Road Name Typography */}
          <g fill="#ffffff" opacity="0.8" fontSize="10.5" fontFamily="var(--font-mono)">
            <text x="25" y="140" fontWeight="bold">ESPAÑA BLVD (MAIN ARTERIAL)</text>
            <text x="685" y="45" transform="rotate(90 685 45)" fontWeight="bold">LACSON AVE</text>
            <text x="245" y="214" fill="#4ade80" fontWeight="bold">JHOCSON ST (SAFE CORRIDOR · ELEVATION 4.2M)</text>
            <text x="245" y="274" fill="#f87171" fontWeight="bold">LOYOLA ST [IMPASSABLE: 1.40M WATER DEPTH]</text>
            <text x="475" y="165" fill="#fbbf24">GERARDO ST [DETOUR]</text>
          </g>

          {/* Landmark Placeholders */}
          <g fill="#ffffff" fontSize="10" fontFamily="var(--font-body)">
            <text x="50" y="60" fontWeight="600" fill="#93c5fd">UST Field Compound</text>
            <text x="265" y="60" fontWeight="600" fill="#fca5a5">National University (NU Manila)</text>
            <text x="495" y="60" fontWeight="700" fill="#86efac">Sampaloc Evacuation Center (Gymnasium)</text>
          </g>

          {/* Loyola Street Hazard Barricade Icons */}
          <g transform="translate(420, 268)">
            <circle cx="12" cy="12" r="16" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <path d="M6 6 L18 18 M18 6 L6 18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <g transform="translate(-65, -28)">
              <rect width="160" height="22" rx="4" fill="#180a0a" stroke="#dc2626" strokeWidth="1" />
              <text x="8" y="15" fill="#fca5a5" fontSize="9" fontFamily="var(--font-mono)" fontWeight="bold">
                ⚠️ SHORTCUT FLOODED: 1.4M
              </text>
            </g>
          </g>

          {/* Crowdsourced Hazard Pins */}
          {showHazardPins && (
            <g className="hazard-markers">
              {/* HZ-101 */}
              <g transform="translate(300, 275)">
                <circle cx="0" cy="0" r="9" fill="#dc2626" stroke="#fff" strokeWidth="1.5" />
                <text x="0" y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">!</text>
              </g>
              {/* HZ-102 */}
              <g transform="translate(465, 145)">
                <circle cx="0" cy="0" r="8" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                <text x="0" y="3.5" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">▲</text>
              </g>
            </g>
          )}

          {/* Rescue Unit Staging Base */}
          <g transform="translate(105, 60)">
            <rect x="0" y="0" width="28" height="28" rx="6" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            <text x="14" y="18" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">HQ</text>
            <text x="14" y="42" textAnchor="middle" fill="#93c5fd" fontSize="8.5" fontFamily="var(--font-mono)">
              Rescue Staging
            </text>
          </g>

          {/* Citizen Victim Target Marker (Block 5 Lot 21 Jhocson St) */}
          <g transform="translate(540, 220)">
            <circle cx="0" cy="0" r="26" fill="none" stroke="#ef4444" strokeWidth="1.5" className="ping-ring" />
            <circle cx="0" cy="0" r="14" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="5" fill="#ffffff" />
            {/* Distress Target Flag */}
            <g transform="translate(20, -32)">
              <rect width="150" height="46" rx="6" fill="#1e0c0c" stroke="#dc2626" strokeWidth="1.5" />
              <text x="10" y="16" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="var(--font-body)">
                RQ-0042 · Maria Santos
              </text>
              <text x="10" y="30" fill="#fca5a5" fontSize="8.5" fontFamily="var(--font-mono)">
                Block 5 Lot 21 Jhocson St.
              </text>
              <text x="10" y="41" fill="#fca5a5" fontSize="8" fontFamily="var(--font-mono)">
                4 people (Infant + Senior)
              </text>
            </g>
          </g>

          {/* Realistic Moving Rescue Craft (Boat with Heading Beacon & Telemetry) */}
          <g transform={`translate(${boatX}, ${boatY})`} className="rescue-boat-marker">
            <circle cx="0" cy="0" r="22" fill="rgba(34, 197, 94, 0.25)" className="pulse-beacon" />
            <circle cx="0" cy="0" r="14" fill="#16a34a" stroke="#ffffff" strokeWidth="2.5" />
            <g transform="translate(-8, -8) scale(0.68)">
              <path d="M2 19c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1" stroke="#ffffff" strokeWidth="2" fill="none" />
              <path d="M4 14l2-6h12l2 6z" stroke="#ffffff" strokeWidth="2" fill="#ffffff" />
              <path d="M12 2v6" stroke="#ffffff" strokeWidth="2" />
            </g>
            {/* Real-time Telemetry Tag */}
            <g transform="translate(18, -14)">
              <rect width="118" height="24" rx="4" fill="#0c2317" stroke="#22c55e" strokeWidth="1" />
              <text x="8" y="16" fill="#86efac" fontSize="8.5" fontWeight="bold" fontFamily="var(--font-mono)">
                Team Alpha · {etaMinutes}m ETA
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Map Bottom Rationale Drawer */}
      <div className="flood-map-explanation">
        <div className="explanation-head">
          <div className="explanation-title">
            <Icon name="shield" size={16} />
            <span>Hydrodynamic Flood Routing Engine Rationale</span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--color-brand-hover)' }}>
            LiPAD Hazard & Elevation Matrix Active
          </span>
        </div>
        <div className="explanation-body">
          <div className="explanation-row">
            <span className="exp-badge exp-avoided">AVOIDED SHORTCUT</span>
            <span className="exp-text">
              <strong>Loyola St. Shortcut:</strong> Water depth reaches <strong>1.40 m</strong> (waist/chest current),
              which exceeds the safe rescue craft threshold (<strong>0.30 m</strong>). High probability of engine stall.
            </span>
          </div>
          <div className="explanation-row">
            <span className="exp-badge exp-selected">ACTIVE SAFE ROUTE</span>
            <span className="exp-text">
              <strong>Jhocson St. Corridor:</strong> High elevation (4.2m AMSL). Minimal surface runoff (0.12m).
              Safety Score: <strong>94/100</strong>. Unit ETA: <strong>{etaMinutes} minutes</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
