import { supabase } from '@/lib/supabase'
import AppointmentForm from '@/app/components/AppointmentForm'
import ClinicCTA from './ClinicCTA'   // ✅ YOU NEED THIS

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default async function ClinicDetail({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { slug, city } = await params

  const cityName = city.replace('-tx', '').replace(/-/g, ' ')

  const { data: clinics } = await supabase
    .from('clinics')
    .select('*')
    .ilike('city', cityName)

  if (!clinics) {
    return <div style={{ padding: 40 }}>Clinic Not Found</div>
  }

  const clinic = clinics.find(
    (c) => slugify(c.name) === slug
  )

  if (!clinic) {
    return <div style={{ padding: 40 }}>Clinic Not Found</div>
  }

  const services = Array.isArray(clinic.services)
    ? clinic.services
    : []

  const insurances = Array.isArray(clinic.insurances)
    ? clinic.insurances
    : []

  const hours =
    typeof clinic.hours === 'string'
      ? clinic.hours
      : clinic.hours?.raw || ''

  return (
    <div className="clinic-detail">

      <div className="clinic-header">
        <h1 className="clinic-title">{clinic.name}</h1>
        <div className="clinic-title-divider"></div>
        <div className="clinic-subtitle">
          {cityName}, TX
        </div>
      </div>

      <div className="clinic-card">

        <div className="info-row">
          <strong>Address</strong>
          <span>{clinic.address}</span>
        </div>

        {services.length > 0 && (
          <div className="info-row">
            <strong>Services</strong>
            <span>{services.join(', ')}</span>
          </div>
        )}

        {insurances.length > 0 && (
          <div className="info-row">
            <strong>Insurance</strong>
            <span>{insurances.join(', ')}</span>
          </div>
        )}

        {hours && (
          <div className="info-row">
            <strong>Hours</strong>
            <span>{hours}</span>
          </div>
        )}

      </div>

      {/* ✅ CLIENT COMPONENT HANDLES BUTTON LOGIC */}
     <ClinicCTA
  phone={clinic.phone}
  city={city}
 
  clinicName={clinic.name}
/>


<div className="back-link" style={{ marginTop: 30 }}>
  <a href={`/dentists/${city}`}>
    ← Browse more dentists in {cityName}
  </a>
</div>

    </div>
  )
}