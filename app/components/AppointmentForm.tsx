'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { getTrackingIdentity } from '@/lib/trackingIdentity'

export default function AppointmentForm({
  clinicName,
  city,
  onClose,
}: {
  clinicName: string
  city: string
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    /*
     * Prevent accidental double submissions.
     */
    if (loading) return

    setLoading(true)

    /*
     * Store the form reference before any await.
     */
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      /*
       * ----------------------------------------
       * 1. Submit the actual appointment lead
       * ----------------------------------------
       */
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinic_name: clinicName,
          city,
          patient_name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message'),
        }),
      })

      /*
       * ----------------------------------------
       * Lead submission failed
       * ----------------------------------------
       */
      if (!response.ok) {
        let result: unknown

        try {
          result = await response.json()
        } catch {
          result = {
            error: 'Unable to read server response',
          }
        }

        console.error(
          'Appointment submission failed:',
          result
        )

        alert(
          'Something went wrong submitting your request.'
        )

        return
      }

      /*
       * ----------------------------------------
       * 2. Lead succeeded.
       * Get anonymous analytics identity.
       * ----------------------------------------
       */
      const { visitorId, sessionId } =
        getTrackingIdentity()

      /*
       * ----------------------------------------
       * 3. Record appointment_submit
       *
       * Analytics failure must NOT make the
       * successful appointment look like it failed.
       * ----------------------------------------
       */
      try {
        const trackingResponse = await fetch(
          '/api/track-call',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clinic_name: clinicName,
              city,
              source_page: window.location.pathname,
              source_position: 'appointment_submit',
              visitor_id: visitorId,
              session_id: sessionId,
            }),
          }
        )

        if (!trackingResponse.ok) {
          console.error(
            'Appointment analytics tracking failed'
          )
        }
      } catch (trackingError) {
        console.error(
          'Appointment analytics request failed:',
          trackingError
        )
      }

      /*
       * ----------------------------------------
       * 4. GA4 conversion tracking
       * ----------------------------------------
       */
      try {
        trackEvent('appointment_submit', {
          clinic_name: clinicName,
          city,
        })
      } catch (analyticsError) {
        console.error(
          'GA appointment tracking failed:',
          analyticsError
        )
      }

      /*
       * ----------------------------------------
       * 5. Show success state
       * ----------------------------------------
       */
      setSuccess(true)
      form.reset()
    } catch (error) {
      console.error(
        'Appointment request error:',
        error
      )

      alert(
        'Something went wrong submitting your request.'
      )
    } finally {
      setLoading(false)
    }
  }

  /*
   * ----------------------------------------
   * Success screen
   * ----------------------------------------
   */
  if (success) {
    return (
      <div className="appointment-card success">
        <h3>✅ Request Submitted</h3>

        <p>
          We&apos;ve sent your appointment request
          successfully.
        </p>

        <button
          type="button"
          className="btn primary"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    )
  }

  /*
   * ----------------------------------------
   * Appointment form
   * ----------------------------------------
   */
  return (
    <div
      id="appointment-form"
      className="appointment-card"
    >
      <h3>Request Appointment Online</h3>

      <p className="clinic-label">
        Clinic: {clinicName}
      </p>

      <form
        onSubmit={handleSubmit}
        className="appointment-form"
      >
        <input
          name="name"
          placeholder="Your Name"
          autoComplete="name"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          autoComplete="tel"
          required
        />

        <textarea
          name="message"
          required
          placeholder="Please include a brief message..."
        />

        <div className="appointment-actions">
          <button
            type="submit"
            className="btn primary"
            disabled={loading}
          >
            {loading
              ? 'Submitting...'
              : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}