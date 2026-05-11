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

/* 🔥 STEP 1 — Dynamic Trust Line */

function getTrustLine(clinic: Clinic) {
  const rating = clinic.google_rating || 0
  const reviews = clinic.google_review_count || 0

  // 🔥 strongest signals first
  if (rating >= 4.9 && reviews >= 200) {
    return `Top-rated with ${reviews}+ patient reviews`
  }

  if (rating >= 4.8 && reviews >= 100) {
    return `Highly rated by ${reviews}+ local patients`
  }

  if (reviews >= 300) {
    return `Trusted by ${reviews}+ patients in the area`
  }

  if (rating >= 4.5 && reviews >= 20) {
    return `Well-reviewed local dental clinic`
  }

  if (reviews > 0 && reviews < 10) {
    return `Recently reviewed by patients`
  }

  return `Accepting new patients`

}


/* 🔥 STEP 2 — Dynamic Urgency */
function getUrgencyLabel(clinic: Clinic) {
  const rating = clinic.google_rating || 0
  const reviews = clinic.google_review_count || 0

  if (clinic.weekend_open === 'YES') {
    return '✔ Open weekends — book faster'
  }

  if (reviews >= 500 && rating >= 4.7) {
    return '✔ High demand — limited slots this week'
  }

  if (rating >= 4.8 && reviews >= 50) {
    return '✔ Top-rated — filling quickly'
  }

  if (reviews >= 20) {
    return '✔ Popular choice nearby'
  }

  return '✔ Accepting new patients'

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

      {/* TRUST */}
      <div className="trust-line">
        {getTrustLine(clinic)}
      </div>

      {/* URGENCY */}
      <div className="urgency-pill">
        {getUrgencyLabel(clinic)}
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