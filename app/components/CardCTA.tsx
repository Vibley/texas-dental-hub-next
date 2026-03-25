'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import AppointmentForm from '@/app/components/AppointmentForm'
import ScrollToTop from '@/app/components/ScrollToTop';

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

  // 🔥 CLEAN CALL HANDLER
  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    trackCall()

    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      // Desktop → show popup ONLY
      e.preventDefault()
      setShowCallPopup(true)
    }
    // Mobile → allow tel: to proceed naturally
  }

  // Auto-close popup
  useEffect(() => {
    if (!showCallPopup) return

    const timer = setTimeout(() => {
      setShowCallPopup(false)
    }, 6000)

    return () => clearTimeout(timer)
  }, [showCallPopup])

  return (
    <>

      <div
        className="card-actions card-cta"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginTop: '10px',
        }}
      >
        {/* 🔥 CALL BUTTON */}
        {phone && (
          <>
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              onClick={handleCallClick}
              style={{
                display: 'block',
                textAlign: 'center',
                background: '#2563eb',
                color: '#fff',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none',
                boxShadow: '0 4px 10px rgba(37,99,235,0.25)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              📞 Call Now
            </a>

            {/* Desktop popup */}
            {showCallPopup && (
              <div
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  zIndex: 9999,
                  background: '#fff',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowCallPopup(false)
                  }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '8px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>

                <div style={{ fontWeight: 600, marginBottom: '6px' }}>
                  📞 {phone}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  Calling works best on mobile devices.
                </div>
              </div>
            )}
          </>
        )}

        {/* 🔥 REQUEST APPOINTMENT */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setShowModal(true)
          }}
          style={{
            width: '100%',
            background: 'transparent',
            color: '#2563eb',
            padding: '10px',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '14px',
            border: '1px solid #dbeafe',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Request Appointment →
        </button>
      </div>

      {/* 🔥 MODAL (FIXED) */}
      {showModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            onClick={() => setShowModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '20px',
                width: '90%',
                maxWidth: '400px',
                position: 'relative',
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowModal(false)
                }}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
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