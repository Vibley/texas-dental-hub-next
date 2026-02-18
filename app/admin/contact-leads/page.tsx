import { createClient } from '@/lib/supabase/server'

export default async function ContactLeadsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from('contact_leads')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Contact Leads</h1>

      <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#e2e8f0' }}>
           
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            
            <th style={th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {leads?.map((lead) => (
            <tr key={lead.id}>
              
              <td style={td}>{lead.name}</td>
              <td style={td}>{lead.email}</td>
              
              <td style={td}>
                {new Date(lead.created_at).toLocaleString()}
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