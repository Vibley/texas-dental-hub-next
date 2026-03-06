export const dynamic = "force-dynamic"

import { createClient } from "@supabase/supabase-js"
import UpgradeButton from "@/app/components/UpgradeButton"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function ClinicsPage() {
  const { data, error } = await supabase
    .from("clinics")
    .select("*")
    .order("city")

  if (error) {
    console.error("Clinics fetch error:", error)
    return <div>Error loading clinics</div>
  }

  const clinics = data ?? []

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Clinics</h1>

      {clinics.length === 0 ? (
        <p>No clinics found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
            }}
          >
            <thead>
              <tr style={{ background: "#e2e8f0" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>City</th>
                <th style={thStyle}>Featured</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            {/* Force stable rendering */}
            <tbody>
              {clinics.map((clinic) => (
                <tr key={clinic.id}>
                  <td style={tdStyle}>{clinic.name}</td>
                  <td style={tdStyle}>{clinic.city}</td>
                  <td style={tdStyle}>
                    {clinic.featured ? "✅ Yes" : "No"}
                  </td>
                  <td style={tdStyle}>
                    {!clinic.featured && (
                      <UpgradeButton
                        clinicId={clinic.id}
                        clinicName={clinic.name}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const thStyle = {
  padding: "10px",
  textAlign: "left" as const,
}

const tdStyle = {
  padding: "10px",
  borderTop: "1px solid #e2e8f0",
}