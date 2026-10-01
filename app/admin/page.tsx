export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type ClinicEvent = {
  clinic_name: string | null
  city: string | null
  event_type: string
  visitor_id: string | null
  session_id: string | null
  created_at: string | null
}

type ClinicStats = {
  clinic: string
  city: string
  calls: number
  uniqueCallers: number
  appointmentOpens: number
  appointments: number
  total: number
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  /*
   * --------------------------------------------------
   * Authentication
   * --------------------------------------------------
   */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin-login')
  }

  /*
   * --------------------------------------------------
   * Date ranges
   * --------------------------------------------------
   */
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const isoDate = sevenDaysAgo.toISOString()

  /*
   * --------------------------------------------------
   * Operational metrics
   * --------------------------------------------------
   */
  const [
    totalLeads,
    totalMessages,
    totalContactLeads,

    leads7,
    messages7,
    contactLeads7,
  ] = await Promise.all([
    supabase
      .from('leads')
      .select('*', {
        count: 'exact',
        head: true,
      }),

    supabase
      .from('contact_messages')
      .select('*', {
        count: 'exact',
        head: true,
      }),

    supabase
      .from('contact_leads')
      .select('*', {
        count: 'exact',
        head: true,
      }),

    supabase
      .from('leads')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .gte('created_at', isoDate),

    supabase
      .from('contact_messages')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .gte('created_at', isoDate),

    supabase
      .from('contact_leads')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .gte('created_at', isoDate),
  ])

  /*
   * --------------------------------------------------
   * Clinic analytics — last 7 days
   * --------------------------------------------------
   */
  const { data: clinicEventsData, error: clinicEventsError } =
    await supabase
      .from('clinic_events')
      .select(`
        clinic_name,
        city,
        event_type,
        visitor_id,
        session_id,
        created_at
      `)
      .gte('created_at', isoDate)

  if (clinicEventsError) {
    console.error(
      'Unable to load clinic analytics:',
      clinicEventsError
    )
  }

  const clinicEvents: ClinicEvent[] =
    clinicEventsData || []

  /*
   * --------------------------------------------------
   * Raw event counts
   * --------------------------------------------------
   */
  const callEvents = clinicEvents.filter(
    (event) => event.event_type === 'call_click'
  )

  const appointmentOpenEvents = clinicEvents.filter(
    (event) =>
      event.event_type === 'appointment_modal_open'
  )

  const appointmentSubmitEvents = clinicEvents.filter(
    (event) =>
      event.event_type === 'appointment_submit'
  )

  /*
   * --------------------------------------------------
   * New analytics only
   *
   * Historical events may have NULL visitor/session IDs.
   * We deliberately do not manufacture identities for them.
   * --------------------------------------------------
   */
  const trackedEvents = clinicEvents.filter(
    (event) => event.visitor_id
  )

  const trackedCallEvents = callEvents.filter(
    (event) => event.visitor_id
  )

  const trackedAppointmentOpenEvents =
    appointmentOpenEvents.filter(
      (event) => event.visitor_id
    )

  const trackedAppointmentSubmitEvents =
    appointmentSubmitEvents.filter(
      (event) => event.visitor_id
    )

  /*
   * --------------------------------------------------
   * Unique visitors
   * --------------------------------------------------
   */
  const uniqueVisitors = new Set(
    trackedEvents
      .map((event) => event.visitor_id)
      .filter(Boolean)
  ).size

  const uniqueCallVisitors = new Set(
    trackedCallEvents
      .map((event) => event.visitor_id)
      .filter(Boolean)
  ).size

  const uniqueAppointmentOpenVisitors = new Set(
    trackedAppointmentOpenEvents
      .map((event) => event.visitor_id)
      .filter(Boolean)
  ).size

  const uniqueAppointmentSubmitVisitors = new Set(
    trackedAppointmentSubmitEvents
      .map((event) => event.visitor_id)
      .filter(Boolean)
  ).size

  /*
   * --------------------------------------------------
   * Unique sessions
   * --------------------------------------------------
   */
  const uniqueSessions = new Set(
    clinicEvents
      .map((event) => event.session_id)
      .filter(Boolean)
  ).size

  /*
   * --------------------------------------------------
   * Appointment conversion
   *
   * Unique visitors who submitted
   * divided by unique visitors who opened the form.
   * --------------------------------------------------
   */
  const appointmentConversion =
    uniqueAppointmentOpenVisitors > 0
      ? (
          (uniqueAppointmentSubmitVisitors /
            uniqueAppointmentOpenVisitors) *
          100
        ).toFixed(1)
      : '0.0'

  /*
   * --------------------------------------------------
   * Call engagement
   *
   * Percentage of tracked visitors who clicked Call Now.
   *
   * NOTE:
   * This is based on visitors represented in clinic_events,
   * not total website traffic.
   * --------------------------------------------------
   */
  const callEngagement =
    uniqueVisitors > 0
      ? (
          (uniqueCallVisitors / uniqueVisitors) *
          100
        ).toFixed(1)
      : '0.0'

  /*
   * --------------------------------------------------
   * Clinic performance
   * --------------------------------------------------
   */
  const clinicMap = new Map<
    string,
    {
      clinic: string
      city: string
      calls: number
      callVisitors: Set<string>
      appointmentOpens: number
      appointments: number
    }
  >()

  clinicEvents.forEach((event) => {
    const clinic =
      event.clinic_name || 'Unknown Clinic'

    const city =
      event.city || 'Unknown'

    /*
     * Clinic name + city avoids accidentally combining
     * same-named clinics in different cities.
     */
    const key = `${clinic}|||${city}`

    if (!clinicMap.has(key)) {
      clinicMap.set(key, {
        clinic,
        city,
        calls: 0,
        callVisitors: new Set<string>(),
        appointmentOpens: 0,
        appointments: 0,
      })
    }

    const stats = clinicMap.get(key)!

    if (event.event_type === 'call_click') {
      stats.calls++

      if (event.visitor_id) {
        stats.callVisitors.add(event.visitor_id)
      }
    }

    if (
      event.event_type ===
      'appointment_modal_open'
    ) {
      stats.appointmentOpens++
    }

    if (
      event.event_type ===
      'appointment_submit'
    ) {
      stats.appointments++
    }
  })

  const clinicRows: ClinicStats[] =
    Array.from(clinicMap.values())
      .map((stats) => ({
        clinic: stats.clinic,
        city: stats.city,
        calls: stats.calls,
        uniqueCallers: stats.callVisitors.size,
        appointmentOpens:
          stats.appointmentOpens,
        appointments: stats.appointments,
        total:
          stats.calls +
          stats.appointments,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

  /*
   * --------------------------------------------------
   * City performance
   * --------------------------------------------------
   */
  const cityMap = new Map<
    string,
    {
      calls: number
      appointments: number
      visitors: Set<string>
    }
  >()

  clinicEvents.forEach((event) => {
    const city = event.city || 'Unknown'

    if (!cityMap.has(city)) {
      cityMap.set(city, {
        calls: 0,
        appointments: 0,
        visitors: new Set<string>(),
      })
    }

    const stats = cityMap.get(city)!

    if (event.event_type === 'call_click') {
      stats.calls++
    }

    if (
      event.event_type ===
      'appointment_submit'
    ) {
      stats.appointments++
    }

    if (event.visitor_id) {
      stats.visitors.add(event.visitor_id)
    }
  })

  const cityRows = Array.from(
    cityMap.entries()
  )
    .map(([city, stats]) => ({
      city,
      visitors: stats.visitors.size,
      calls: stats.calls,
      appointments: stats.appointments,
      total:
        stats.calls +
        stats.appointments,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  /*
   * --------------------------------------------------
   * Render
   * --------------------------------------------------
   */

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          marginBottom: '30px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              marginBottom: '8px',
            }}
          >
            Admin Dashboard
          </h1>

          <p
            style={{
              margin: 0,
              color: '#64748b',
            }}
          >
            Welcome, {user.email}
          </p>
        </div>

        <form
          action="/api/admin/logout"
          method="get"
        >
          <button
            type="submit"
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#fff',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        </form>
      </div>

      {/* ==========================================
          LAST 7 DAYS — BUSINESS RESULTS
      ========================================== */}

      <SectionTitle>
        Last 7 Days — Business Results
      </SectionTitle>

      <StatsGrid>
        <StatCard
          title="Appointment Leads"
          value={leads7.count || 0}
          subtitle="Requests received"
        />

        <StatCard
          title="Call Now Clicks"
          value={callEvents.length}
          subtitle="Raw call-button activity"
        />

        <StatCard
          title="Unique Call Visitors"
          value={uniqueCallVisitors}
          subtitle="Tracked visitors who clicked"
        />

        <StatCard
          title="Appointments Submitted"
          value={appointmentSubmitEvents.length}
          subtitle="Tracked submissions"
        />
      </StatsGrid>

      {/* ==========================================
          FUNNEL
      ========================================== */}

      <SectionDivider />

      <SectionTitle>
        Appointment Funnel — Last 7 Days
      </SectionTitle>

      <StatsGrid>
        <StatCard
          title="Form Opens"
          value={appointmentOpenEvents.length}
          subtitle="Raw modal opens"
        />

        <StatCard
          title="Unique Form Visitors"
          value={uniqueAppointmentOpenVisitors}
          subtitle="Visitors who opened form"
        />

        <StatCard
          title="Unique Submitters"
          value={uniqueAppointmentSubmitVisitors}
          subtitle="Visitors who submitted"
        />

        <StatCard
          title="Form Conversion"
          value={`${appointmentConversion}%`}
          subtitle="Unique submitters ÷ openers"
        />
      </StatsGrid>

      {/* ==========================================
          VISITOR ANALYTICS
      ========================================== */}

      <SectionDivider />

      <SectionTitle>
        Visitor Analytics — Last 7 Days
      </SectionTitle>

      <StatsGrid>
        <StatCard
          title="Tracked Visitors"
          value={uniqueVisitors}
          subtitle="Anonymous browser IDs"
        />

        <StatCard
          title="Tracked Sessions"
          value={uniqueSessions}
          subtitle="Anonymous sessions"
        />

        <StatCard
          title="Call Visitors"
          value={uniqueCallVisitors}
          subtitle="Unique call-button visitors"
        />

        <StatCard
          title="Call Engagement"
          value={`${callEngagement}%`}
          subtitle="Call visitors ÷ tracked visitors"
        />
      </StatsGrid>

      <p
        style={{
          marginTop: '14px',
          color: '#64748b',
          fontSize: '13px',
          lineHeight: 1.5,
        }}
      >
        Visitor and session analytics only include
        events recorded after anonymous tracking was
        enabled. Older events remain available but do
        not have visitor or session IDs.
      </p>

      {/* ==========================================
          TOP CLINICS
      ========================================== */}

      <SectionDivider />

      <SectionTitle>
        Clinic Performance — Last 7 Days
      </SectionTitle>

      {clinicRows.length > 0 ? (
        <div
          style={{
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#fff',
              borderRadius: '12px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom:
                    '1px solid #e2e8f0',
                  textAlign: 'left',
                }}
              >
                <TableHeader>Clinic</TableHeader>

                <TableHeader>City</TableHeader>

                <TableHeader>Calls</TableHeader>

                <TableHeader>
                  Unique Call Visitors
                </TableHeader>

                <TableHeader>
                  Form Opens
                </TableHeader>

                <TableHeader>
                  Appointments
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {clinicRows.map(
                (row, index) => (
                  <tr
                    key={`${row.clinic}-${row.city}`}
                    style={{
                      borderBottom:
                        '1px solid #f1f5f9',
                      background:
                        index === 0
                          ? '#f8fafc'
                          : 'transparent',
                    }}
                  >
                    <TableCell bold>
                      {row.clinic}
                    </TableCell>

                    <TableCell>
                      {formatCity(row.city)}
                    </TableCell>

                    <TableCell>
                      {row.calls}
                    </TableCell>

                    <TableCell>
                      {row.uniqueCallers}
                    </TableCell>

                    <TableCell>
                      {row.appointmentOpens}
                    </TableCell>

                    <TableCell bold>
                      {row.appointments}
                    </TableCell>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState>
          No clinic activity recorded during the
          last 7 days.
        </EmptyState>
      )}

      {/* ==========================================
          CITY PERFORMANCE
      ========================================== */}

      <SectionDivider />

      <SectionTitle>
        City Performance — Last 7 Days
      </SectionTitle>

      {cityRows.length > 0 ? (
        <div
          style={{
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#fff',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom:
                    '1px solid #e2e8f0',
                  textAlign: 'left',
                }}
              >
                <TableHeader>City</TableHeader>

                <TableHeader>
                  Tracked Visitors
                </TableHeader>

                <TableHeader>Call Clicks</TableHeader>

                <TableHeader>
                  Appointments
                </TableHeader>

                <TableHeader>
                  Lead Actions
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {cityRows.map((row) => (
                <tr
                  key={row.city}
                  style={{
                    borderBottom:
                      '1px solid #f1f5f9',
                  }}
                >
                  <TableCell bold>
                    {formatCity(row.city)}
                  </TableCell>

                  <TableCell>
                    {row.visitors}
                  </TableCell>

                  <TableCell>
                    {row.calls}
                  </TableCell>

                  <TableCell>
                    {row.appointments}
                  </TableCell>

                  <TableCell bold>
                    {row.total}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState>
          No city activity recorded during the last
          7 days.
        </EmptyState>
      )}

      {/* ==========================================
          ALL TIME
      ========================================== */}

      <SectionDivider />

      <SectionTitle>
        All-Time Operational Data
      </SectionTitle>

      <StatsGrid>
        <StatCard
          title="Total Leads"
          value={totalLeads.count || 0}
        />

        <StatCard
          title="Total Messages"
          value={totalMessages.count || 0}
        />

        <StatCard
          title="Total Contact Leads"
          value={totalContactLeads.count || 0}
        />

        <StatCard
          title="Messages (7d)"
          value={messages7.count || 0}
        />
      </StatsGrid>

      <div style={{ height: '50px' }} />
    </div>
  )
}

/*
 * ==================================================
 * COMPONENTS
 * ==================================================
 */

function StatsGrid({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '18px',
        width: '100%',
      }}
    >
      {children}
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: number | string
  subtitle?: string
}) {
  return (
    <div
      style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow:
          '0 3px 10px rgba(15,23,42,0.05)',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          color: '#64748b',
          fontWeight: 500,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: '30px',
          fontWeight: 700,
          marginTop: '8px',
          color: '#0f172a',
        }}
      >
        {value}
      </div>

      {subtitle && (
        <div
          style={{
            fontSize: '12px',
            color: '#94a3b8',
            marginTop: '6px',
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  )
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <h2
      style={{
        marginBottom: '20px',
        fontSize: '21px',
      }}
    >
      {children}
    </h2>
  )
}

function SectionDivider() {
  return (
    <hr
      style={{
        margin: '40px 0',
        border: 0,
        borderTop: '1px solid #e2e8f0',
      }}
    />
  )
}

function TableHeader({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <th
      style={{
        padding: '12px',
        fontSize: '13px',
        color: '#475569',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </th>
  )
}

function TableCell({
  children,
  bold = false,
}: {
  children: React.ReactNode
  bold?: boolean
}) {
  return (
    <td
      style={{
        padding: '12px',
        fontSize: '14px',
        fontWeight: bold ? 600 : 400,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </td>
  )
}

function EmptyState({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        padding: '30px',
        textAlign: 'center',
        background: '#f8fafc',
        borderRadius: '12px',
        color: '#64748b',
      }}
    >
      {children}
    </div>
  )
}

function formatCity(city: string) {
  return city
    .split(' ')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(' ')
}