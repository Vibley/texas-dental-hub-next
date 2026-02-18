'use client'

import { useState, useEffect } from 'react'
import AppointmentForm from '@/app/components/AppointmentForm'

export default function ClinicCTA({
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

  const isMobile =
    typeof navigator !== 'undefined' &&
    /Mobi|Android/i.test(navigator.userAgent)

  const trackCall = () => {
    fetch('/api/track-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clinic_name: clinicName,
        city,
        source_page: window.location.pathname,
        source_position: 'clinic_detail_call_button',
      }),
    }).catch(() => {})
  }

  const handleCallClick = () => {
    trackCall()

    if (!isMobile) {
      setShowCallPopup(true)
    }
  }

  // 🔥 Auto-close popup after 6 seconds
  useEffect(() => {
    if (!showCallPopup) return

    const timer = setTimeout(() => {
      setShowCallPopup(false)
    }, 6000)

    return () => clearTimeout(timer)
  }, [showCallPopup])

  return (
    <>
      <div className="clinic-cta">

        {/* Call Button */}
        {phone && (
          <>
            {isMobile ? (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="btn primary"
                onClick={handleCallClick}
              >
                Call Clinic
              </a>
            ) : (
              <button
                className="btn primary"
                onClick={handleCallClick}
              >
                Call Clinic
              </button>
            )}

            {/* Desktop Floating Popup */}
            {showCallPopup && !isMobile && (
              <div className="call-popup">
                <button
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

        {/* Appointment Button */}
        <button
          className="btn secondary"
          onClick={() => setShowModal(true)}
        >
          Request Appointment
        </button>

      </div>

      {/* Appointment Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
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
        </div>
      )}
    </>
  )
}