'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function UpdatePassword() {
  const supabase = createClient()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // 🔥 VERY IMPORTANT: Initialize recovery session
  useEffect(() => {
    const initSession = async () => {
      await supabase.auth.getSession()
      setLoading(false)
    }

    initSession()
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password updated successfully.')
      setTimeout(() => {
        router.push('/admin-login')
      }, 1500)
    }
  }

  if (loading) {
    return <div style={{ margin: '80px auto', maxWidth: '400px' }}>Loading...</div>
  }

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto' }}>
      <h2>Set New Password</h2>

      <form onSubmit={handleUpdate}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <button type="submit">Update Password</button>
      </form>

      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  )
}
