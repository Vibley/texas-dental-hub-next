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

const hours = (() => {
  if (!clinic.hours) return ''

  // If hours is already a string
  if (typeof clinic.hours === 'string') return clinic.hours

  // If raw exists
  if (clinic.hours.raw) {
    try {
      const parsed = JSON.parse(clinic.hours.raw)
      return parsed.text || clinic.hours.raw
    } catch {
      return clinic.hours.raw
    }
  }

  return ''
})()




  const photoUrl = clinic.google_photo_reference && clinic.google_photo_reference !== 'undefined'
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${clinic.google_photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    : '/placeholder-dental.jpg'


return (
  <div className="clinic-detail">

    {/* 🔙 Back Link (moved to top) */}
    <div className="back-link-top">
      <a href={`/dentists/${city}`}>
        ← Back to {cityName} dentists
      </a>
    </div>

    {/* 🔥 HERO SECTION */}
    <div className="clinic-hero">

 <img
    src={photoUrl}
    alt={clinic.name}
    loading="lazy"
    style={{
      width: "20%",
      height: "180px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "10px"
    }}
  />


      <div className="clinic-hero-content">

        <h1 className="clinic-title">{clinic.name}</h1>

        <div className="clinic-subtitle">
          {cityName}, TX
        </div>

        {clinic.google_rating && (
          <div className="hero-rating">
            ⭐ {clinic.google_rating.toFixed(1)}{" "}
            {clinic.google_review_count && `(${clinic.google_review_count} reviews)`}
          </div>
        )}

      </div>
    </div>

    {/* 🔥 CTA moved UP */}
    <ClinicCTA
      phone={clinic.phone}
      city={city}
      clinicName={clinic.name}
    />

    {/* 🔥 INFO CARD */}
    <div className="clinic-card">

     

      <div className="info-row">
        <div className="info-label">Address</div>
        <div className="info-value">
          <a
            href={
              clinic.google_maps_url ||
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                clinic.google_formatted_address || clinic.address
              )}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {(clinic.google_formatted_address
              ? clinic.google_formatted_address.replace(", USA", "")
              : clinic.address)}
          </a>
        </div>
      </div>

      {services.length > 0 && (
        <div className="info-row">
          <div className="info-label">Services</div>
          <div className="info-value">{services.join(', ')}</div>
        </div>
      )}

      {insurances.length > 0 && (
        <div className="info-row">
          <div className="info-label">Insurance</div>
          <div className="info-value">
            <div className="insurance-pills">
              {insurances.map((ins: string, i: number) => (
                <span key={i} className="pill">{ins}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {hours && (
        <div className="info-row">
          <div className="info-label">Hours</div>
          <div className="info-value">{hours}</div>
        </div>
      )}

    </div>

    {/* 🔥 CLAIM LISTING (upgraded) */}
    <div className="claim-listing-box premium">

      <div className="claim-listing-title">
        Own this dental practice?
      </div>

      <div className="claim-listing-text">
        Get more patients, manage your listing, and receive appointment requests.
      </div>

      {/*<div className="claim-highlight">
        🚀 Free listing optimization available
      </div>*/}

      <a
        href={`/contact?type=Claim%20Listing&clinic=${encodeURIComponent(clinic.name)}`}
        className="claim-listing-btn"
      >
        Claim This Listing
      </a>

    </div>

  </div>
)



}