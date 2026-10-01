'use client'

import { useState, useMemo } from 'react'
import ClinicCard from './components/ClinicCard'
import FilterBar from './components/FilterBar'
import type { Clinic } from '@/app/types'

/* Houston coordinates */
const HOUSTON_LAT = 29.7604
const HOUSTON_LNG = -95.3698

/* Distance calculator */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

type City = {
  city_name: string
  city_slug: string
  latitude?: number
  longitude?: number
}

export default function HomePage({
  cities,
  initialClinics,
}: {
  cities: City[]
  initialClinics: Clinic[]
}) {

  const [clinics] = useState<Clinic[]>(initialClinics)

  const [filteredClinics, setFilteredClinics] =
    useState<Clinic[]>(initialClinics)

  const featuredClinics = filteredClinics.filter(
    (clinic) => clinic.featured === true
  )

  const regularClinics = filteredClinics.filter(
    (clinic) => clinic.featured !== true
  )

  /*
   * Top-Rated Houston Dental Practices
   *
   * Eligibility:
   * - Google rating of 4.5 or higher
   * - At least 50 Google reviews
   *
   * Ranking:
   * - Highest Google rating first
   * - Review count breaks ties
   * - Featured status does not affect ranking
   */
const topRatedClinics = useMemo(() => {
  return [...filteredClinics]
    .filter(
      (clinic) =>
        typeof clinic.google_rating === 'number' &&
        typeof clinic.google_review_count === 'number' &&
        clinic.google_rating >= 4.5 &&
        clinic.google_review_count >= 50
    )
    .sort((a, b) => {
      const ratingDifference =
        (b.google_rating ?? 0) - (a.google_rating ?? 0)

      if (ratingDifference !== 0) {
        return ratingDifference
      }

      return (
        (b.google_review_count ?? 0) -
        (a.google_review_count ?? 0)
      )
    })
    .slice(0, 3)
}, [filteredClinics])

  const nearbyCities = useMemo(() => {
    return [...cities]
      .filter((city) => city.city_slug !== 'houston')
      .map((city: City) => ({
        ...city,

        distance: getDistance(
          HOUSTON_LAT,
          HOUSTON_LNG,
          city.latitude ?? 0,
          city.longitude ?? 0
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8)
      .filter((city) => city.distance < 100)
  }, [cities])

  return (
    <>
      {/* HERO */}
      <div className="hero hero-expanded">

        <h1>Find Top-Rated Dentists in Houston, TX</h1>

        <p className="hero-subtext">
          Browse verified dental clinics in Houston with real patient reviews,
          services, and accepted insurance plans.
        </p>

        <p className="hero-subtext">
          Whether you need a family dentist, emergency care, cosmetic dentistry,
          or dental implants — find the right provider near you.
        </p>

      </div>

      {/* ACTION PANEL */}
      <div className="search-panel">

        <p className="filter-intent">
          Find dentists by service, insurance, or location:
        </p>

        <FilterBar
          clinics={clinics}
          onFilter={setFilteredClinics}
        />

      </div>

      {/* TOP-RATED DENTAL PRACTICES */}
      {topRatedClinics.length >= 3 && (
        <section className="section top-rated-section">

          <div className="top-rated-heading">

            <h2>
              Top-Rated Dental Practices in Houston
            </h2>

            <p className="top-rated-intro">
              Compare highly rated Houston dental practices using Google
              ratings and review counts.
            </p>

          </div>

          <div className="top-rated-grid">

            {topRatedClinics.map((clinic, index) => (

              <div
                key={clinic.id}
                className="top-rated-item"
              >

                <div className="top-rated-rank">
                  #{index + 1}
                </div>

                <div className="top-rated-content">

                  <h3>
                    <a
                      href={`/dentists/houston/${slugify(clinic.name)}`}
                    >
                      {clinic.name}
                    </a>
                  </h3>

                  <div className="top-rated-rating">
                    ⭐ {clinic.google_rating?.toFixed(1)}

                    {clinic.google_review_count != null && (
                      <span>
                        {' '}
                        ({clinic.google_review_count.toLocaleString()} Google reviews)
                      </span>
                    )}
                  </div>

                  <a
                    href={`/dentists/houston/${slugify(clinic.name)}`}
                    className="top-rated-profile-link"
                  >
                    View Practice →
                  </a>

                </div>

              </div>

            ))}

          </div>

          <p className="top-rated-methodology">
            Top-rated selections are based on Google ratings and review counts.
            Featured status does not affect rankings.
          </p>

        </section>
      )}

      {/* EMPTY FILTER RESULT */}
      {filteredClinics.length === 0 && (
        <div
          className="section"
          style={{
            textAlign: 'left',
            padding: '10px 0',
          }}
        >

          <h3>No dentists found in Houston</h3>

          <p
            style={{
              marginTop: '10px',
              color: '#666',
            }}
          >
            Try adjusting your filters to see more clinics.
          </p>

        </div>
      )}

      {/* FEATURED DENTISTS */}
      {featuredClinics.length > 0 && (
        <div className="section">

          <h2 className="featured-title">
            ⭐ Featured Dentists in Houston
          </h2>

          <div className="grid">

            {featuredClinics.map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
              />
            ))}

          </div>

        </div>
      )}

      {/* ALL DENTISTS */}
      {regularClinics.length > 0 && (
        <div className="section">

          <h2 className="all-dentists-title">
            All Dentists in Houston
          </h2>

          <div className="grid">

            {regularClinics.map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
              />
            ))}

          </div>

        </div>
      )}

            
    {/* HOUSTON FAQs */}
<section className="section city-faq-section">

  <h2>
    Frequently Asked Questions About Dentists in Houston
  </h2>

  <p className="city-faq-intro">
    Find answers about appointments, emergency dental care, weekend
    availability, insurance, and how practices are displayed on
    TexasDentalHub.
  </p>

  <div className="city-faq-list">

    <details className="city-faq-item">
      <summary>
        How can I find a dentist in Houston accepting new patients?
      </summary>

      <p>
        Use the TexasDentalHub filters to narrow the listings to dental
        practices marked as accepting new patients. You can then compare
        ratings, services, location, and other practice information before
        contacting the dental office directly.
      </p>
    </details>

    <details className="city-faq-item">
      <summary>
        How can I find an emergency dentist in Houston?
      </summary>

      <p>
        Use the emergency availability filter to find dental practices in
        Houston listed as offering emergency dental care. Contact the
        practice directly to confirm current availability and whether they
        can treat your specific dental emergency.
      </p>
    </details>

    <details className="city-faq-item">
      <summary>
        Which dentists in Houston are open on weekends?
      </summary>

      <p>
        Use the weekend availability filter to identify dental practices
        listed as offering weekend hours. Office schedules can change, so
        confirm the current hours with the practice before visiting.
      </p>
    </details>

    <details className="city-faq-item">
      <summary>
        Can I search Houston dentists by insurance?
      </summary>

      <p>
        TexasDentalHub allows you to compare dental practices using
        available insurance information. Because participation and coverage
        can change, confirm that your specific insurance plan is accepted
        by the dental office or your insurance company before scheduling
        treatment.
      </p>
    </details>

    <details className="city-faq-item">
      <summary>
        How are Top-Rated dental practices in Houston selected?
      </summary>

      <p>
        Top-Rated practices are selected from eligible TexasDentalHub
        listings with a Google rating of 4.5 or higher and at least 50
        Google reviews. Practices are ordered by Google rating, with review
        count used when ratings are equal. Featured listing status does not
        affect the ranking.
      </p>
    </details>

  </div>

</section>        

{/* NEARBY CITIES */}
<div className="section city-directory">

  <h3>Dentists Near Houston</h3>

  <div className="city-links-grid">

    {nearbyCities.map((city) => (
      <a
        key={city.city_slug}
        href={`/dentists/${city.city_slug}`}
        className="city-link"
        
        aria-label={`Dentists in ${city.city_name}`}
      >
        Dentists in {city.city_name}
      </a>
    ))}

  </div>

</div>
    </>
  )
}