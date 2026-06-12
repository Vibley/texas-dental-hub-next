'use client'

import { useRouter } from 'next/navigation'
import CardCTA from '@/app/components/CardCTA'

type Clinic = {
  id: string
  name: string
  address: string
  phone?: string
  city: string
  featured?: boolean

  google_rating?: number
  google_review_count?: number
  google_photo_reference?: string
  google_maps_url?: string
  google_formatted_address?: string
  website?: string
  weekend_open?: string
  accepts_new_patients?: boolean
  emergency_available?: boolean  
}




function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function formatCityState(city?: string) {
  if (!city) return 'Texas'

  const cleanCity =
    city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()

  return `${cleanCity}, TX`
}



function getClinicBadges(clinic: Clinic) {
  const badges: string[] = []

  const rating = clinic.google_rating || 0
  const reviews = clinic.google_review_count || 0

  if (clinic.emergency_available === true) {
    badges.push("Emergency appointments")
  }

  if (clinic.weekend_open === "yes") {
    badges.push("Open weekends")
  }

  if (clinic.accepts_new_patients === true) {
    badges.push("Accepting new patients")
  }



  if (badges.length === 0) {
    badges.push("Local dental clinic")
  }

  return badges
}

export default function ClinicCard({ clinic }: { clinic: Clinic }) {
  const router = useRouter()

  const citySlug = clinic.city.toLowerCase().replace(/\s+/g, '-')
  const clinicSlug = slugify(clinic.name)
  const cityState = formatCityState(clinic.city)

  const goToDetail = () => {
    router.push(`/dentists/${citySlug}/${clinicSlug}`, { scroll: true })
  }

 

  const displayAddress =
    clinic.google_formatted_address?.replace(', USA', '') ||
    clinic.address

  const shortAddress = displayAddress
    ?.split(',')
    .slice(0, 2)
    .join(' • ')

 return (
  <div
    className={`card ${clinic.featured ? 'featured-card' : ''}`}
    onClick={(e) => {
      if ((e.target as HTMLElement).closest('.card-actions')) return
      goToDetail()
    }}
  >
    {/* TOP ACCENT */}
    <div className="card-top-accent" />

    <div className="card-content">

      {/* FEATURED */}
      {clinic.featured && (
        <span className="featured-badge">
          ⭐ Featured
        </span>
      )}

      {/* NAME */}
      <h3 className="clinic-name">
        {clinic.name}
      </h3>

      {/* RATING */}
   <div className="rating-row">
  {clinic.google_rating ? (
    <>
      <span className="rating-star">⭐</span>

      <span className="rating-number">
        {clinic.google_rating.toFixed(1)}
      </span>

      <span className="review-count">
        ({clinic.google_review_count} Google reviews)
      </span>
    </>
  ) : (
    <span className="review-count">
      New clinic profile
    </span>
  )}
</div>

    

      {/* URGENCY */}
      
{/* BADGES */}
<div
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '16px',
    minHeight: '72px',
    alignContent: 'flex-start',
    justifyContent: 'left',
  }}
>
  {getClinicBadges(clinic).slice(0, 3).map((badge) => (
    <span
      key={badge}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '999px',
        border: '1px solid #a7f3d0',
        backgroundColor: '#ecfdf5',
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#047857',
      }}
    >
      ✓ {badge}
    </span>
  ))}
</div>



      {/* LOCATION */}
      <div className="location-row">
        📍 {cityState}
      </div>

      {/* CTA */}
      <div className="card-cta-wrapper">
        <CardCTA
          phone={clinic.phone}
          city={citySlug}
          clinicName={clinic.name}
        />
      </div>

    </div>
  </div>
)




}