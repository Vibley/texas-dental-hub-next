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


const photoUrl = clinic.google_photo_reference
  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${clinic.google_photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
  : "/placeholder-dental.jpg"


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

     
{clinic.google_rating && (
  <div className="info-row">
    <strong>Rating</strong>

    <span className="clinic-rating">

      <span className="stars">
        {"★".repeat(Math.round(clinic.google_rating))}
        {"☆".repeat(5 - Math.round(clinic.google_rating))}
      </span>

      <span className="rating-number">
        {clinic.google_rating.toFixed(1)}
      </span>

      {clinic.google_review_count && (
        <span className="review-count">
          ({clinic.google_review_count} Google reviews)
        </span>
      )}

    </span>

  </div>
)}


<div className="info-row">




  <strong>Address</strong>

  <span>
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
  </span>

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

    {/* Patient Actions */}
    <ClinicCTA
      phone={clinic.phone}
      city={city}
      clinicName={clinic.name}
    />

    {/* Claim Listing Section */}
<div className="claim-listing-box">

  <div className="claim-listing-title">
    Own this dental practice?
  </div>

  <div className="claim-listing-text">
    Claim this listing to update your information, receive appointment requests
    directly, and promote your practice to more patients in {cityName}.
  </div>

  <a
    href={`/contact?type=Claim%20Listing&clinic=${encodeURIComponent(clinic.name)}`}
    className="claim-listing-btn"
  >
    Claim This Listing
  </a>

</div>

    <div className="back-link">
      <a href={`/dentists/${city}`}>
        ← Browse more dentists in {cityName}
      </a>
    </div>

  </div>
)



}