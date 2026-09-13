import { Icon } from '../../../../components/art/Icon'
import './LocalizedForecastWidget.css'

export interface HourlyForecastItem {
  time?: string
  temp?: number | string
  rainMm?: number | string
  pop?: string
  icon?: string
}

export interface WaterStationItem {
  name?: string
  status?: string
  currentLevel?: number | string
}

interface LocalizedForecastWidgetProps {
  hourly?: HourlyForecastItem[]
  waterStations?: WaterStationItem[]
}

export function LocalizedForecastWidget({ hourly = [] }: LocalizedForecastWidgetProps) {
  const currentWeather = {
    location: 'Sampaloc / España District',
    subLocation: 'PAGASA Radar & River Basin Gauge Network',
    temp: 29,
    condition: 'Heavy Tropical Rain',
    high: 31,
    low: 25,
    humidity: '92%',
    wind: '24 km/h SW',
    precipitation: '18 mm/hr',
    warning: 'RED FLOOD WARNING: High Tide & Heavy Rainfall Expected at 2:00 PM',
  }

  return (
    <div className="ios-weather-container red-theme-inset compact-left">
      {/* BACKGROUND IMAGE LAYER */}
      <div className="weather-bg-image-layer" />

      {/* INSET NEUMORPHIC RED WARNING BANNER */}
      <div className="weather-warning-banner neu-inset-card">
        <Icon name="alert" size={18} />
        <span>{currentWeather.warning}</span>
      </div>

      {/* MAIN IOS WEATHER HEADER */}
      <div className="weather-main-row">
        <div className="weather-main-info">
          <span className="weather-location">{currentWeather.location}</span>
          <span className="weather-sublocation">{currentWeather.subLocation}</span>
          
          {/* TEMPERATURE DISPLAY WITH INLINE ANIMATED CLOUD */}
          <div className="temp-cloud-wrapper">
            <h2 className="weather-temp">{currentWeather.temp}°</h2>
            <div className="inline-cloud-animated" aria-hidden="true">
              <span className="cloud-icon">🌧️</span>
            </div>
          </div>

          <span className="weather-condition">{currentWeather.condition}</span>
          <div className="weather-hi-lo">
            <span>H: {currentWeather.high}°</span>
            <span>L: {currentWeather.low}°</span>
          </div>
        </div>

        {/* INSET NEUMORPHIC METRIC BADGES */}
        <div className="weather-metrics-grid">
          <div className="weather-metric-badge neu-inset-card">
            <Icon name="droplet" size={16} />
            <div>
              <span className="metric-label">PRECIPITATION</span>
              <strong className="metric-value">{currentWeather.precipitation}</strong>
            </div>
          </div>

          <div className="weather-metric-badge neu-inset-card">
            <Icon name="wind" size={16} />
            <div>
              <span className="metric-label">WIND</span>
              <strong className="metric-value">{currentWeather.wind}</strong>
            </div>
          </div>

          <div className="weather-metric-badge neu-inset-card">
            <Icon name="humidity" size={16} />
            <div>
              <span className="metric-label">HUMIDITY</span>
              <strong className="metric-value">{currentWeather.humidity}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* HOURLY FORECAST STRIP */}
      <div className="weather-hourly-strip">
        <div className="hourly-title">
          <Icon name="clock" size={14} />
          <span>HOURLY FORECAST & RAINFALL INTENSITY</span>
        </div>
        
        <div className="hourly-scroll-container">
          {hourly.length > 0 ? (
            hourly.map((item, index) => (
              <div key={index} className="hourly-card neu-inset-card">
                <span className="hourly-time">{item.time || `${index + 1} PM`}</span>
                <span className="hourly-icon">🌧️</span>
                <span className="hourly-temp">{item.temp ?? 28}°</span>
                <span className="hourly-rain-pop">{item.rainMm ? `${item.rainMm}mm` : '80%'}</span>
              </div>
            ))
          ) : (
            [
              { time: 'Now', temp: '29°', pop: '90%', icon: '🌧️' },
              { time: '12 PM', temp: '29°', pop: '95%', icon: '⛈️' },
              { time: '1 PM', temp: '30°', pop: '85%', icon: '🌧️' },
              { time: '2 PM', temp: '31°', pop: '100%', icon: '⛈️' },
              { time: '3 PM', temp: '30°', pop: '70%', icon: '🌧️' },
              { time: '4 PM', temp: '28°', pop: '60%', icon: '🌦️' },
              { time: '5 PM', temp: '26°', pop: '40%', icon: '☁️' },
              { time: '6 PM', temp: '25°', pop: '20%', icon: '☁️' },
            ].map((item, idx) => (
              <div key={idx} className="hourly-card neu-inset-card">
                <span className="hourly-time">{item.time}</span>
                <span className="hourly-icon">{item.icon}</span>
                <span className="hourly-temp">{item.temp}</span>
                <span className="hourly-rain-pop">{item.pop}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}