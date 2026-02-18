import { createClient } from '@/lib/supabase/server'

export default async function ContactMessagesPage() {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Contact Messages</h1>

      <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#e2e8f0' }}>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Message</th>
            <th style={th}>Date</th>
	    <th style={th}>Inquiry Type</th>
            <th style={th}>Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {messages?.map((msg) => (
            <tr key={msg.id}>
              <td style={td}>{msg.full_name}</td>
              <td style={td}>{msg.email}</td>
              <td style={td}>{msg.message}</td>
              <td style={td}>{new Date(msg.created_at).toLocaleString()}</td>
              <td style={td}>{msg.inquiry_type}</td>
              <td style={td}>
                <form action={`/admin/contact-messages/delete?id=${msg.id}`} method="post">
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

const th = { padding: '10px', textAlign: 'left' as const }
const td = { padding: '10px', borderTop: '1px solid #e2e8f0' }