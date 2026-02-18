import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin-login')
  }

  // 🔹 Calculate 7-day cutoff
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const isoDate = sevenDaysAgo.toISOString()

  // 🔹 Parallel queries
  const [
    totalLeads,
    totalMessages,
    totalContactLeads,
    totalCallClicks,
    leads7,
    messages7,
    contactLeads7,
    callClicks7,
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('contact_leads').select('*', { count: 'exact', head: true }),
    supabase.from('call_clicks').select('*', { count: 'exact', head: true }),

    supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', isoDate),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).gte('created_at', isoDate),
    supabase.from('contact_leads').select('*', { count: 'exact', head: true }).gte('created_at', isoDate),
    supabase.from('call_clicks').select('*', { count: 'exact', head: true }).gte('created_at', isoDate),
  ])

  return (
    <div>
      <h1 style={{ marginBottom: '10px' }}>Admin Dashboard</h1>
      <p>Welcome, {user.email}</p>

      <br />

      <form action="/api/admin/logout" method="get">
        <button type="submit">Logout</button>
      </form>

      <hr style={{ margin: '30px 0' }} />

      <h2 style={{ marginBottom: '20px' }}>Last 7 Days</h2>

      <StatsGrid>
        <StatCard title="Leads (7d)" value={leads7.count || 0} />
        <StatCard title="Messages (7d)" value={messages7.count || 0} />
        <StatCard title="Contact Leads (7d)" value={contactLeads7.count || 0} />
        <StatCard title="Call Clicks (7d)" value={callClicks7.count || 0} />
      </StatsGrid>

      <hr style={{ margin: '40px 0' }} />

      <h2 style={{ marginBottom: '20px' }}>All Time</h2>

      <StatsGrid>
        <StatCard title="Total Leads" value={totalLeads.count || 0} />
        <StatCard title="Total Messages" value={totalMessages.count || 0} />
        <StatCard title="Total Contact Leads" value={totalContactLeads.count || 0} />
        <StatCard title="Total Call Clicks" value={totalCallClicks.count || 0} />
      </StatsGrid>
    </div>
  )
}

function StatsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
      }}
    >
      {children}
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div
      style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ fontSize: '14px', color: '#64748b' }}>{title}</div>
      <div style={{ fontSize: '30px', fontWeight: 'bold', marginTop: '10px' }}>
        {value}
      </div>
    </div>
  )
}