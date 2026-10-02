'use client'

import { useMemo, useState } from 'react'
import ClinicCard from './components/ClinicCard'
import FilterBar from './components/FilterBar'
import type { Clinic } from '@/app/types'

/* Houston coordinates */
const HOUSTON_LAT = 29.7604
const HOUSTON_LNG = -95.3698

/* Distance calculator */
function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371

  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
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
  const [clinics] =
    useState<Clinic[]>(initialClinics)

  const [filteredClinics, setFilteredClinics] =
    useState<Clinic[]>(initialClinics)

  /*
   * Find the closest cities to Houston for
   * homepage internal navigation.
   */
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
      {/* =====================================================
          HERO
          ===================================================== */}

      <div className="hero hero-expanded">

        <h1>
          Find Top-Rated Dentists in Houston, TX
        </h1>

        <p className="hero-subtext">
          Browse dental clinics in Houston with Google
          ratings, services, and accepted insurance
          information.
        </p>

        <p className="hero-subtext">
          Whether you need a family dentist, emergency
          care, cosmetic dentistry, or dental implants —
          compare local practices and connect directly
          with the dental office.
        </p>

      </div>


      {/* =====================================================
          SEARCH / FILTER PANEL
          ===================================================== */}

      <div className="search-panel">

        <p className="filter-intent">
          Find dentists by service, insurance, or location:
        </p>

        <FilterBar
          clinics={clinics}
          onFilter={setFilteredClinics}
        />

      </div>


      {/* =====================================================
          DIRECTORY RESULTS
          ===================================================== */}

      <section className="section directory-results-section">

        <div className="directory-results-heading">

          <h2>
            {filteredClinics.length.toLocaleString()}{" "}
            {filteredClinics.length === 1
              ? 'Dentist'
              : 'Dentists'}{' '}
            in Houston
          </h2>

        </div>


        {filteredClinics.length > 0 ? (

          <div className="directory-results-list">

            {filteredClinics.map((clinic) => (

              <ClinicCard
                key={clinic.id}
                clinic={clinic}
              />

            ))}

          </div>

        ) : (

          <div className="directory-empty-state">

            <h3>
              No dentists found in Houston
            </h3>

            <p>
              Try adjusting your filters to see more
              dental practices.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          HOUSTON FAQs
          ===================================================== */}

      <section className="section city-faq-section">

        <div className="city-faq-heading">

          <h2>
            Frequently Asked Questions About Dentists in
            Houston
          </h2>

          <p>
            Find answers about new-patient availability,
            emergency dental care, weekend hours,
            insurance, and finding dental practices in
            Houston.
          </p>

        </div>


        <div className="city-faq-list">

          {/* ACCEPTING NEW PATIENTS */}

          <details className="city-faq-item">

            <summary>

              <span>
                How can I find a dentist in Houston
                accepting new patients?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                Use the Accepting New Patients filter to
                find Houston dental practices marked as
                accepting new patients. You can then
                compare ratings, services, location, and
                other practice information before
                contacting the dental office directly.
              </p>

            </div>

          </details>


          {/* EMERGENCY */}

          <details className="city-faq-item">

            <summary>

              <span>
                How can I find an emergency dentist in
                Houston?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                Use the Emergency Appointments option to
                find Houston dental practices listed as
                offering emergency appointments. Contact
                the clinic directly to confirm current
                availability and whether it can treat your
                specific dental need.
              </p>

            </div>

          </details>


          {/* WEEKENDS */}

          <details className="city-faq-item">

            <summary>

              <span>
                Which dentists in Houston are open on
                weekends?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                Use the Open Weekends option to find
                Houston dental practices listed as
                offering weekend hours. Office schedules
                can change, so confirm current hours
                directly with the clinic before visiting.
              </p>

            </div>

          </details>


          {/* INSURANCE */}

          <details className="city-faq-item">

            <summary>

              <span>
                Can I search Houston dentists by insurance?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                Yes. Use the Insurance filter to compare
                Houston dental practices using available
                insurance information. Because
                participation and coverage can change,
                confirm your specific plan with the dental
                office or your insurance company before
                scheduling treatment.
              </p>

            </div>

          </details>


          {/* SERVICES */}

          <details className="city-faq-item">

            <summary>

              <span>
                Can I search Houston dentists by dental
                service?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                Yes. Use the Services filter to narrow the
                list of Houston dental practices using the
                service information available on
                TexasDentalHub. Review the practice
                details and contact the dental office
                directly to confirm that the specific
                treatment you need is currently offered.
              </p>

            </div>

          </details>

        </div>

      </section>


      {/* =====================================================
          NEARBY CITIES
          ===================================================== */}

      {nearbyCities.length > 0 && (

        <section className="section city-directory">

          <div className="city-directory-heading">

            <h2>
              Explore Dentists in Nearby Cities
            </h2>

          </div>


          <div className="city-links-grid">

            {nearbyCities.map((city) => (

              <a
                key={city.city_slug}
                href={`/dentists/${city.city_slug}`}
                className="city-link"
                aria-label={`Dentists in ${city.city_name}`}
              >

                <span>
                  Dentists in {city.city_name}
                </span>

                <span
                  className="city-link-arrow"
                  aria-hidden="true"
                >
                  →
                </span>

              </a>

            ))}

          </div>

        </section>

      )}

    </>
  )
}