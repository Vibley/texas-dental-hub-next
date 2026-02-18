import { createClient } from '@/lib/supabase/server'

export default async function CallClicksPage() {
  const supabase = await createClient()

  const { data: clicks } = await supabase
    .from('call_clicks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Call Clicks</h1>

      <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#e2e8f0' }}>
            <th style={th}>Clinic</th>
            <th style={th}>City</th>
            <th style={th}>Source Page</th>
            <th style={th}>Source Position</th>
            <th style={th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {clicks?.map((click) => (
            <tr key={click.id}>
              <td style={td}>{click.clinic_name}</td>
              <td style={td}>{click.city}</td>
              <td style={td}>{click.source_page}</td>
             <td style={td}>{click.source_position}</td>
              <td style={td}>
                {new Date(click.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const th = { padding: '10px', textAlign: 'left' as const }
const td = { padding: '10px', borderTop: '1px solid #e2e8f0' }