'use client'

import { useRouter } from 'next/navigation'
import CardCTA from '@/app/components/CardCTA'

type Clinic = {
  id: string
  name: string
  address: string
  phone?: string
  city: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ClinicCard({ clinic }: { clinic: Clinic }) {
  const router = useRouter()

  const goToDetail = () => {
    const citySlug = clinic.city
      .toLowerCase()
      .replace(/\s+/g, '-')

    const clinicSlug = slugify(clinic.name)

    router.push(
      `/dentists/${citySlug}/clinic/${clinicSlug}`
    )
  }

  return (
  
<div
  className="card"
  onClick={(e) => {
    // Only navigate if clicking directly on card,
    // not inside buttons or modal
    if ((e.target as HTMLElement).closest('.card-actions')) return
    goToDetail()
  }}
  style={{ cursor: 'pointer' }}
>

      <h3>{clinic.name}</h3>

      <div className="address-text">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            clinic.address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="map-link"
        >
          {clinic.address}
        </a>
      </div>

      {/* 🔥 Unified CTA Logic */}
      <CardCTA
        phone={clinic.phone}
        city={`${clinic.city.toLowerCase().replace(/\s+/g, '-')}`}
        clinicName={clinic.name}
      />
    </div>
  )
}