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
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ClinicCard({ clinic }: { clinic: Clinic }) {

  const router = useRouter()

  const citySlug = clinic.city
    .toLowerCase()
    .replace(/\s+/g, '-')

  const clinicSlug = slugify(clinic.name)

  const goToDetail = () => {
   router.push(
  `/dentists/${citySlug}/clinic/${clinicSlug}`,
  { scroll: true }
)
  }

  const photoUrl = clinic.google_photo_reference && clinic.google_photo_reference !== 'undefined'
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${clinic.google_photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    : '/placeholder-dental.jpg'

  const displayAddress =
    clinic.google_formatted_address?.replace(', USA', '') || clinic.address

const shortAddress =
  (clinic.google_formatted_address || clinic.address)
    ?.replace(", USA", "")
    ?.split(",")
    .slice(0, 2)
    .join(" • ")


  return (

    <div
      className={`card ${clinic.featured ? 'featured-card' : ''}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.card-actions')) return
        goToDetail()
      }}
      style={{ cursor: 'pointer' }}
    >

<div className="clinic-photo">

  {clinic.featured && (
    <span className="featured-badge">⭐ Featured</span>
  )}

  {clinic.google_rating && (
    <span className="rating-badge">
      ⭐ {clinic.google_rating.toFixed(1)}
    </span>
  )}

  <img
    src={photoUrl}
    alt={clinic.name}
    loading="lazy"
    style={{
      width: "100%",
      height: "180px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "10px"
    }}
  />

</div>

      <h3>{clinic.name}</h3>


  {clinic.google_rating && (
  <div className="clinic-rating">

    <span className="stars">
      {"★".repeat(Math.round(clinic.google_rating))}
      {"☆".repeat(5 - Math.round(clinic.google_rating))}
    </span>

    <span className="rating-number">
      {clinic.google_rating.toFixed(1)}
    </span>

    {clinic.google_review_count && (
      <span className="review-count">
        ({clinic.google_review_count})
      </span>
    )}

  </div>
)}


     <p>{shortAddress}</p>

      <div className="address-text">

        <a
          href={clinic.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="map-link"
        >
          View on Google Maps
        </a>

      </div>

      <CardCTA
        phone={clinic.phone}
        city={citySlug}
        clinicName={clinic.name}
      />

    </div>
  )
}