import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
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
          <Link href="/admin/clinics" style={{ color: 'white' }}>Clinics</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px', background: '#f1f5f9' }}>
        {children}
      </main>
    </div>
  )
}