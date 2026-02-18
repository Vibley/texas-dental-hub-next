import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = 'hintsahagosllc@gmail.com' // 🔒 change if needed

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 🔒 Not logged in
  if (!user) {
    redirect('/admin-login')
  }

  // 🔒 Logged in but NOT your email
  if (user.email !== ADMIN_EMAIL) {
    redirect('/admin-login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          background: '#0f172a',
          color: 'white',
          padding: '20px',
        }}
      >
        <h2 style={{ marginBottom: '30px' }}>Admin</h2>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link href="/admin" style={{ color: 'white' }}>Dashboard</Link>
          <Link href="/admin/leads" style={{ color: 'white' }}>Leads</Link>
          <Link href="/admin/contact-messages" style={{ color: 'white' }}>Contact Messages</Link>
          <Link href="/admin/contact-leads" style={{ color: 'white' }}>Contact Leads</Link>
          <Link href="/admin/call-clicks" style={{ color: 'white' }}>Call Clicks</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '40px', background: '#f1f5f9' }}>
        {children}
      </main>
    </div>
  )
}