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

/*
 * Convert clinic name into URL-safe slug.
 */
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/*
 * Format city consistently.
 *
 * Example:
 * houston -> Houston, TX
 * sugar land -> Sugar Land, TX
 */
function formatCityState(city?: string) {
  if (!city) return 'Texas'

  const cleanCity = city
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(' ')

  return `${cleanCity}, TX`
}

/*
 * Build badges only from verified clinic fields.
 */
function getClinicBadges(clinic: Clinic) {
  const badges: string[] = []

  if (clinic.emergency_available === true) {
    badges.push('Emergency appointments')
  }

  if (
    clinic.weekend_open
      ?.trim()
      .toLowerCase() === 'yes'
  ) {
    badges.push('Open weekends')
  }

  if (clinic.accepts_new_patients === true) {
    badges.push('Accepting new patients')
  }

  return badges
}

export default function ClinicCard({
  clinic,
}: {
  clinic: Clinic
}) {
  const router = useRouter()

  const citySlug = clinic.city
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

  const clinicSlug = slugify(clinic.name)

  const cityState = formatCityState(clinic.city)

  const badges = getClinicBadges(clinic)

  const goToDetail = () => {
    router.push(
      `/dentists/${citySlug}/${clinicSlug}`,
      {
        scroll: true,
      }
    )
  }

  return (
    <div
      className={`card ${
        clinic.featured ? 'featured-card' : ''
      }`}
      role="link"
      tabIndex={0}
      aria-label={`View ${clinic.name}`}
      onClick={(e) => {
        /*
         * Do not navigate to the clinic detail page
         * when the user clicks Call Now or
         * Request Appointment.
         */
        if (
          (e.target as HTMLElement).closest(
            '.card-actions'
          )
        ) {
          return
        }

        goToDetail()
      }}
      onKeyDown={(e) => {
        /*
         * Keyboard accessibility for the card.
         */
        if (
          e.key === 'Enter' ||
          e.key === ' '
        ) {
          e.preventDefault()
          goToDetail()
        }
      }}
      style={{
        cursor: 'pointer',
      }}
    >
      {/* TOP ACCENT */}

      <div className="card-top-accent" />

      <div className="card-content">

        {/* FEATURED */}

       {clinic.featured && (
  <div className="featured-badge-row">
    <span className="featured-badge">
      ⭐ Featured
    </span>
  </div>
)}

        {/* CLINIC NAME */}

        <h3 className="clinic-name">
          {clinic.name}
        </h3>

        {/* GOOGLE RATING */}

        <div className="rating-row">
          {typeof clinic.google_rating ===
            'number' &&
          clinic.google_rating > 0 ? (
            <>
              <span
                className="rating-star"
                aria-hidden="true"
              >
                ⭐
              </span>

              <span className="rating-number">
                {clinic.google_rating.toFixed(1)}
              </span>

              {typeof clinic.google_review_count ===
                'number' && (
                <span className="review-count">
                  {clinic.google_review_count.toLocaleString()}{' '}
                  Google reviews
                </span>
              )}
            </>
          ) : (
            <span className="review-count">
              New clinic profile
            </span>
          )}
        </div>

        {/* BADGES

            Keep this container rendered even when
            there are no badges.

            Desktop CSS reserves the same badge area
            for every card so the location and CTA
            buttons remain aligned across the row.
        */}

        <div className="clinic-badges">
          {badges
            .slice(0, 3)
            .map((badge) => (
              <span
                key={badge}
                className="clinic-badge"
              >
                ✓ {badge}
              </span>
            ))}
        </div>

      {/* ADDRESS */}
<div className="clinic-address">
  <span className="clinic-address-icon" aria-hidden="true">
    📍
  </span>

  <span
    className="clinic-street"
    title={clinic.address}
  >
    {clinic.address?.split(',')[0] || cityState}
  </span>
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