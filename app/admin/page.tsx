export const dynamic = "force-dynamic"
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

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const isoDate = sevenDaysAgo.toISOString()

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

  /* 🔥 NEW — Clinic Performance Query */
  const { data: clinicEvents } = await supabase
    .from('clinic_events')
    .select('clinic_name, event_type, created_at')
    .gte('created_at', isoDate)

  const clinicMap: Record<
    string,
    { calls: number; appointments: number }
  > = {}

  clinicEvents?.forEach((event) => {
    if (!clinicMap[event.clinic_name]) {
      clinicMap[event.clinic_name] = { calls: 0, appointments: 0 }
    }

    if (event.event_type === 'call_click') {
      clinicMap[event.clinic_name].calls++
    }

    if (event.event_type === 'appointment_submit') {
      clinicMap[event.clinic_name].appointments++
    }
  })

  const clinicRows = Object.entries(clinicMap)
    .map(([clinic, stats]) => ({
      clinic,
      calls: stats.calls,
      appointments: stats.appointments,
      total: stats.calls + stats.appointments,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

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

      {/* 🔥 NEW SECTION */}
      <hr style={{ margin: '40px 0' }} />

      <h2 style={{ marginBottom: '20px' }}>
        Top Performing Clinics (Last 7 Days)
      </h2>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Clinic</th>
            <th style={{ padding: '10px' }}>Calls</th>
            <th style={{ padding: '10px' }}>Appointments</th>
            <th style={{ padding: '10px' }}>Total</th>
          </tr>
        </thead>

        <tbody>
          {clinicRows.map((row, index) => (
            <tr
              key={row.clinic}
              style={{
                borderBottom: '1px solid #f5f5f5',
                background: index === 0 ? '#f0f9ff' : 'transparent',
              }}
            >
              <td style={{ padding: '10px', fontWeight: 500 }}>
                {row.clinic}
              </td>

              <td style={{ padding: '10px' }}>{row.calls}</td>

              <td style={{ padding: '10px' }}>
                {row.appointments}
              </td>

              <td style={{ padding: '10px', fontWeight: 600 }}>
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        width: '100%',
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