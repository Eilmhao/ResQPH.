import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import './auth.css'

const SLIDES = [
  '/resqph-flood-rescue.png',
  '/ResQPHposter.jpg',
  '/ManilaMap.jpg',
  '/LiveTracker.jpg',
]

interface AuthLayoutProps {
  children: ReactNode
  rawContainer?: boolean
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevIndex) => (prevIndex + 1) % SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prevIndex) => (prevIndex + 1) % SLIDES.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prevIndex) => (prevIndex - 1 + SLIDES.length) % SLIDES.length)
  }

  return (
    <div className="auth-sky-page">
      {/* Brand Logo - Upper Right */}
      <div className="auth-top-brand">
        <span className="auth-brand-name">ResQPH</span>
      </div>

      {/* LEFT SIDE: Slideshow Section */}
      <div className="auth-left-section">
        {/* Render stacked slides for smooth opacity cross-fading */}
        {SLIDES.map((slide, index) => (
          <div
            key={slide}
            className={`auth-hero-layer auth-hero-blur ${
              index === currentSlide ? 'is-active' : ''
            }`}
            style={{ backgroundImage: `url(${slide})` }}
          />
        ))}

        {SLIDES.map((slide, index) => (
          <div
            key={`crisp-${slide}`}
            className={`auth-hero-layer auth-hero-crisp ${
              index === currentSlide ? 'is-active' : ''
            }`}
            style={{ backgroundImage: `url(${slide})` }}
          />
        ))}

        {/* Navigation Arrow Controls */}
        <button
          type="button"
          className="slideshow-arrow arrow-left"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          &#10094;
        </button>

        <button
          type="button"
          className="slideshow-arrow arrow-right"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          &#10095;
        </button>
      </div>

      {/* RIGHT SIDE: Login Card Container */}
      <div className="auth-right-section">
        <div className="auth-card-wrapper">{children}</div>
      </div>
    </div>
  )
}