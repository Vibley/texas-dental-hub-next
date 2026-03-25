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

  website?: string // 👈 ADD THIS (future-proof)
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

        {/* Featured */}
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
            ⭐ {clinic.google_rating.toFixed(1)}{' '}
            {clinic.google_review_count && (
              <span style={{ color: '#666' }}>
                ({clinic.google_review_count} reviews)
              </span>
            )}
          </div>
        )}

        {/* LOCATION */}

      
<p style={{ fontSize: '14px', color: '#555', marginBottom: '6px' }}>
  📍 {cityState}
</p>


        {/* TRUST LINE */}
        {/* <p style={{fontSize: '12px', color: '#777',fontStyle: 'italic', marginBottom: '10px' }}>Known for quality care and friendly staff</p>*/}

        {/* REMOVE THIS OR KEEP SMALL */}
        {/* 
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
        */}

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