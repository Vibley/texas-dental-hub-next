'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ContactForm({
  inquiryType = "General Inquiry",
}: {
  inquiryType?: string
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget

    setLoading(true)
    setSuccess(false)
    setError(false)

    const formData = new FormData(form)

    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
         full_name: formData.get('name')?.toString(),
      email: formData.get('email')?.toString(),
      phone: formData.get('phone')?.toString() || null,
      message: formData.get('message')?.toString(),
      user_type: formData.get('user_type')?.toString(),
      inquiry_type: inquiryType,
        },
      ])

    setLoading(false)

    if (!error) {
      form.reset()
      setSuccess(true)
    } else {
      console.error(error)
      setError(true)
    }
  }

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(false), 5000)
    return () => clearTimeout(timer)
  }, [success])

  return (
    
<form onSubmit={handleSubmit} className="contact-form">

 

  <p className="form-subtitle">
    We typically respond within 24 hours.
  </p>

  <div className="form-group">
    <label>I am a:</label>
    <select name="user_type" required>
      <option value="">Select</option>
      <option value="patient">Patient</option>
      <option value="clinic">Dental Clinic</option>
    </select>
  </div>

  <div className="form-group">
    <label>Full Name</label>
    <input name="name" required />
  </div>

  <div className="form-group">
    <label>Email</label>
    <input name="email" type="email" required />
  </div>

  <div className="form-group">
    <label>Phone (optional)</label>
    <input name="phone" type="tel" />
  </div>

  <div className="form-group">
    <label>Message</label>
    <textarea name="message" rows={5} required />
  </div>

  <button type="submit" disabled={loading}>
    {loading ? 'Sending...' : 'Send Message'}
  </button>

  {success && (
    <div className="success">
      ✅ Thanks! We’ll get back to you shortly.
    </div>
  )}

  {error && (
    <div className="error">
      ❌ Something went wrong. Please try again.
    </div>
  )}

</form>

  )
}