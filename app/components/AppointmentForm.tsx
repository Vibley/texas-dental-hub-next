'use client'

import { useState } from 'react'

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

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setLoading(true)

  const form = e.currentTarget  // ✅ store reference BEFORE await
  const formData = new FormData(form)

  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clinic_name: clinicName,
      city: city,
      patient_name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    }),
  })

  setLoading(false)

  if (response.ok) {
    setSuccess(true)
    form.reset()   // ✅ now safe
  } else {
    const result = await response.json()
    console.error(result)
    alert('Something went wrong submitting your request.')
  }
}

  if (success) {
    return (
      <div className="appointment-card success">
        <h3>✅ Request Submitted</h3>
        <p>We’ve sent your appointment request successfully.</p>
        <button className="btn primary" onClick={onClose}>
          Close
        </button>
      </div>
    )
  }

  return (
    <div id="appointment-form" className="appointment-card">
      <h3>Request Appointment Online</h3>
      <p className="clinic-label">Clinic: {clinicName}</p>

      <form onSubmit={handleSubmit} className="appointment-form">
        <input
          name="name"
          placeholder="Your Name"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          required
        />

        <textarea
          name="message"
          required
          placeholder="Please include a brief message..."
        />

        <div className="appointment-actions">
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>

          
        </div>
      </form>
    </div>
  )
}