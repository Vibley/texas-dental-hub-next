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
          full_name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
          inquiry_type: inquiryType, // ✅ CRITICAL FIX
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

      {/* Hidden Field (Optional for debugging) */}
      <input type="hidden" value={inquiryType} />

      <div className="form-group">
        <label>Full Name</label>
        <input name="name" required />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input name="email" type="email" required />
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
          ✅ Your message has been sent successfully.
        </div>
      )}

      {error && (
        <div className="error">
          ❌ Failed to send message. Please try again.
        </div>
      )}

    </form>
  )
}