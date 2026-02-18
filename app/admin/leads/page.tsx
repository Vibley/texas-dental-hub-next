import { createClient } from '@/lib/supabase/server'

export default async function LeadsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Leads</h1>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'white',
        }}
      >
        <thead>
          <tr style={{ background: '#e2e8f0' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads?.map((lead) => (
            <tr key={lead.id}>
              <td style={tdStyle}>{lead.name}</td>
              <td style={tdStyle}>{lead.email}</td>
              <td style={tdStyle}>{lead.phone}</td>
              <td style={tdStyle}>
  <form action={`/admin/leads/update?id=${lead.id}`} method="post">
    <select
      name="status"
      defaultValue={lead.status}
      style={{ padding: '4px' }}
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="closed">Closed</option>
    </select>

    <button
      type="submit"
      style={{
        marginLeft: '8px',
        padding: '4px 8px',
        cursor: 'pointer',
      }}
    >
      Save
    </button>
  </form>
</td>
              <td style={tdStyle}>
                {new Date(lead.created_at).toLocaleString()}
              </td>
              <td style={tdStyle}>
                <form action={`/admin/leads/delete?id=${lead.id}`} method="post">
                  <button style={{ color: 'red' }}>Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const thStyle = {
  padding: '10px',
  textAlign: 'left' as const,
}

const tdStyle = {
  padding: '10px',
  borderTop: '1px solid #e2e8f0',
}