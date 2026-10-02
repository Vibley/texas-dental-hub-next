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

  services?: string[]
  insurances?: string[]

  google_rating?: number
  google_review_count?: number
  google_maps_url?: string
  google_formatted_address?: string

  weekend_open?: string
  accepts_new_patients?: boolean
  emergency_available?: boolean
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getClinicBadges(clinic: Clinic) {
  const badges: string[] = []

  if (clinic.accepts_new_patients === true) {
    badges.push('Accepting new patients')
  }

  if (clinic.emergency_available === true) {
    badges.push('Emergency appointments')
  }

  if (clinic.weekend_open?.trim().toLowerCase() === 'yes') {
    badges.push('Open weekends')
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

  const detailUrl =
    `/dentists/${citySlug}/${clinicSlug}`

  const badges = getClinicBadges(clinic)

  const visibleServices =
    clinic.services
      ?.filter(Boolean)
      .slice(0, 4) || []

  function goToDetail() {
    router.push(detailUrl, {
      scroll: true,
    })
  }

  return (
    <article
      className={`directory-result ${
        clinic.featured
          ? 'directory-result-featured'
          : ''
      }`}
      onClick={(e) => {
        if (
          (e.target as HTMLElement).closest(
            '.card-actions'
          )
        ) {
          return
        }

        goToDetail()
      }}
    >
      <div className="directory-result-main">

        {/* HEADER */}

        <div className="directory-result-header">

          <div className="directory-result-title-area">

            {clinic.featured && (
              <span className="directory-featured-badge">
                Featured
              </span>
            )}

            <h3 className="directory-result-name">
              <a
                href={detailUrl}
                onClick={(e) => e.stopPropagation()}
              >
                {clinic.name}
              </a>
            </h3>

          </div>

          {/* RATING */}

          <div className="directory-rating">

            {typeof clinic.google_rating ===
              'number' &&
            clinic.google_rating > 0 ? (
              <>
                <span
                  className="directory-rating-star"
                  aria-hidden="true"
                >
                  ★
                </span>

                <strong>
                  {clinic.google_rating.toFixed(1)}
                </strong>

                {typeof clinic.google_review_count ===
                  'number' && (
                  <span className="directory-review-count">
                    (
                    {clinic.google_review_count.toLocaleString()}
                    {' '}Google reviews)
                  </span>
                )}
              </>
            ) : (
              <span className="directory-review-count">
                New clinic profile
              </span>
            )}

          </div>

        </div>

        {/* ADDRESS */}

        <div className="directory-address">
          <span aria-hidden="true">📍</span>

          <span>
            {clinic.google_formatted_address ||
              clinic.address}
          </span>
        </div>

        {/* BADGES */}

        {badges.length > 0 && (
          <div className="directory-badges">

            {badges.map((badge) => (
              <span
                key={badge}
                className="directory-badge"
              >
                ✓ {badge}
              </span>
            ))}

          </div>
        )}

        {/* SERVICES */}

        {visibleServices.length > 0 && (
          <div className="directory-services">

            {visibleServices.map((service) => (
              <span
                key={service}
                className="directory-service"
              >
                {service}
              </span>
            ))}

          </div>
        )}

        {/* PROFILE LINK */}

        <div className="directory-profile-row">
          <a
            href={detailUrl}
            className="directory-profile-link"
            onClick={(e) => e.stopPropagation()}
          >
            View practice details →
          </a>
        </div>

      </div>

      {/* ACTION AREA */}

      <div
        className="directory-result-actions"
        onClick={(e) => e.stopPropagation()}
      >
        <CardCTA
          phone={clinic.phone}
          city={citySlug}
          clinicName={clinic.name}
        />
      </div>

    </article>
  )
}