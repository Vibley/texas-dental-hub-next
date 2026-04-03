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

  if (reviews > 0 && reviews < 5) {
    return 'Recently reviewed by patients'
  }

  if (rating >= 4.8 && reviews > 80) {
    return 'Consistently top patient satisfaction'
  }

  if (rating >= 4.5 && reviews >= 5) {
    return 'Known for quality dental care'
  }

  if (reviews > 50) {
    return 'Trusted by many local families'
  }

  return 'Local dental clinic accepting patients'
}




/* 🔥 STEP 2 — Dynamic Urgency */
function getUrgencyLabel(clinic: Clinic) {
  const rating = clinic.google_rating || 0
  const reviews = clinic.google_review_count || 0

  if (clinic.weekend_open === 'YES') {
    return '✔ Weekend appointments available'
  }

  if (reviews > 100) {
    return '✔ High demand this week'
  }

  if (rating >= 4.8 && reviews >= 20) {
    return '✔ Top-rated near you'
  }

  if (reviews >= 5) {
    return '✔ Bookings filling fast'
  }

  return '✔ New listing — available now'
}

export default function ClinicCard({ clinic }: { clinic: Clinic }) {
  const router = useRouter()

  const citySlug = clinic.city.toLowerCase().replace(/\s+/g, '-')
  const clinicSlug = slugify(clinic.name)
  const cityState = formatCityState(clinic.city)

  const goToDetail = () => {
    router.push(`/dentists/${citySlug}/${clinicSlug}`, { scroll: true })
  }

  const photoUrl =
    clinic.google_photo_reference &&
    clinic.google_photo_reference !== 'undefined'
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${clinic.google_photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      : '/placeholder-dental.jpg'

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
      style={{
        cursor: 'pointer',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        background: '#fff',
        transition: 'all 0.2s ease'
      }}
    >
      {/* IMAGE */}
      <div style={{ position: 'relative' }}>
        <img
          src={photoUrl}
          alt={clinic.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover'
          }}
        />

        {clinic.featured && (
          <span
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: '#2563eb',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px'
            }}
          >
            ⭐ Featured
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: '14px' }}>
        {/* NAME */}
        <h3 style={{ marginBottom: '6px' }}>{clinic.name}</h3>

        {/* RATING */}
        {clinic.google_rating && (
          <div style={{ fontSize: '14px', marginBottom: '4px' }}>
            ⭐ {clinic.google_rating.toFixed(1)} from{' '}
            {clinic.google_review_count && (
              <span style={{ color: '#666' }}>
                {clinic.google_review_count} patients
              </span>
            )}
          </div>
        )}

        {/* 🔥 STEP 3 — Social Proof + Urgency */}
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '2px'
        }}>
          {getTrustLine(clinic)}
        </p>

        <p style={{
          fontSize: '12px',
          color: '#059669',
          fontWeight: 600,
          marginTop: '4px'
        }}>
          {getUrgencyLabel(clinic)}
        </p>

        {/* LOCATION */}
        <p style={{ fontSize: '14px', color: '#555', marginBottom: '6px' }}>
          📍 {cityState}
        </p>

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          <div style={{ width: '100%', maxWidth: '260px' }}>
            <CardCTA
              phone={clinic.phone}
              city={citySlug}
              clinicName={clinic.name}
            />
          </div>
        </div>
      </div>
    </div>
  )
}