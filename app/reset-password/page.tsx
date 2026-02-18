'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPassword() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for reset instructions.')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto' }}>
      <h2>Reset Password</h2>

      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <button type="submit">Send Reset Link</button>
      </form>

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  )
}