'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import AppointmentForm from '@/app/components/AppointmentForm'

export default function CardCTA({
  phone,
  city,
  clinicName,
}: {
  phone?: string
  city: string
  clinicName: string
}) {
  const [showModal, setShowModal] = useState(false)
  const [showCallPopup, setShowCallPopup] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const trackCall = () => {
    fetch('/api/track-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clinic_name: clinicName,
        city,
        source_page: window.location.pathname,
        source_position: 'card_call_button',
      }),
    }).catch(() => {})
  }

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    trackCall()

    // Only show popup on desktop
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      e.preventDefault()
      setShowCallPopup(true)
    }
  }

  useEffect(() => {
    if (!showCallPopup) return

    const timer = setTimeout(() => {
      setShowCallPopup(false)
    }, 6000)

    return () => clearTimeout(timer)
  }, [showCallPopup])

  return (
    <>
      <div className="card-actions">

        {phone && (
          <>
            {/* ✅ Always use tel: link */}
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="btn"
              onClick={handleCallClick}
            >
              Call to Schedule
            </a>

            {/* Desktop popup only */}
            {showCallPopup && (
              <div className="call-popup">
                <button
                  type="button"
                  className="call-popup-close"
                  onClick={() => setShowCallPopup(false)}
                >
                  ✕
                </button>
                <div className="call-popup-number">
                  📞 {phone}
                </div>
                <div className="call-popup-note">
                  Calling works best on mobile devices.
                </div>
              </div>
            )}
          </>
        )}

        <button
          type="button"
          className="btn secondary"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setShowModal(true)
          }}
        >
          Request Appointment
        </button>

      </div>

      {/* ✅ Modal via Portal */}
      {mounted &&
        showModal &&
        createPortal(
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>

              <AppointmentForm
                clinicName={clinicName}
                city={city}
                onClose={() => setShowModal(false)}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}