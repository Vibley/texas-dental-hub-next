export const dynamic = "force-dynamic"

import { supabaseAdmin } from "@/lib/supabase/admin"
import UpgradeButton from "@/app/components/UpgradeButton"
import DowngradeButton from "@/app/components/DowngradeButton"

export default async function ClinicsPage({ searchParams }: any) {

  const params = await searchParams

  const city = params?.city || ""
  const search = params?.search || ""
  const featured = params?.featured || ""

  /* ---------------------------------
     Fetch Cities Dynamically
  --------------------------------- */

  const { data: cityData } = await supabaseAdmin
    .from("clinics")
    .select("city")

  const cities = [
    ...new Set(cityData?.map((c) => c.city).filter(Boolean))
  ].sort()

  /* ---------------------------------
     Build Query
  --------------------------------- */

  let query = supabaseAdmin
    .from("clinics")
    .select("*")
    .order("city")

  if (city) {
    query = query.eq("city", city)
  }

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  if (featured === "true") {
    query = query.eq("featured", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Clinics fetch error:", error)
    return <div>Error loading clinics</div>
  }

  const clinics = data ?? []

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Clinics</h1>

      {/* FILTER BAR */}

      <form
        method="GET"
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >

        {/* Search */}
        <input
          name="search"
          placeholder="Search clinic name"
          defaultValue={search}
          style={{ padding: "6px" }}
        />

        {/* City Dropdown */}
        <select
          name="city"
          defaultValue={city}
          style={{ padding: "6px" }}
        >
          <option value="">All Cities</option>

          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Featured */}
        <select
          name="featured"
          defaultValue={featured}
          style={{ padding: "6px" }}
        >
          <option value="">All</option>
          <option value="true">Featured Only</option>
        </select>

        <button style={{ padding: "6px 12px" }}>
          Search
        </button>

      </form>

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

            <tbody>
              {clinics.map((clinic) => (
                <tr key={clinic.id}>
                  <td style={tdStyle}>{clinic.name}</td>
                  <td style={tdStyle}>{clinic.city}</td>

                  <td style={tdStyle}>
                    {clinic.featured ? "✅ Yes" : "No"}
                  </td>


                <td style={tdStyle}>

  {clinic.featured ? (
    <DowngradeButton clinicId={clinic.id} />
  ) : (
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