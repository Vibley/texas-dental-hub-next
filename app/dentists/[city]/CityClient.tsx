"use client"

import { useCallback, useState } from "react"
import FilterBar from "@/app/components/FilterBar"
import ClinicCard from "@/app/components/ClinicCard"
import type { Clinic } from "@/app/types"

type CitySeo = {
  intro_paragraph1: string | null
  intro_paragraph2: string | null
  meta_title: string | null
  meta_description: string | null
}

const CLINICS_PER_PAGE = 10

export default function CityClient({
  city,
  cityName,
  clinics,
  citySeo,
  nearbyCities,
}: {
  city: string
  cityName: string
  clinics: Clinic[]
  citySeo: CitySeo | null
  nearbyCities: {
    city_name: string
    city_slug: string
  }[]
}) {
  const [filteredClinics, setFilteredClinics] =
    useState<Clinic[]>(clinics)

  const [visibleCount, setVisibleCount] =
    useState(CLINICS_PER_PAGE)

  /* =====================================================
     PAGINATION / LOAD MORE
     ===================================================== */

  const visibleClinics =
    filteredClinics.slice(0, visibleCount)

  const hasMoreClinics =
    visibleCount < filteredClinics.length

  const handleFilter = useCallback((results: Clinic[]) => {
  setFilteredClinics(results)
  setVisibleCount(CLINICS_PER_PAGE)
}, [])

  function handleLoadMore() {
    setVisibleCount((current) =>
      Math.min(
        current + CLINICS_PER_PAGE,
        filteredClinics.length
      )
    )
  }

  return (
    <div className="container">

      {/* =====================================================
          HERO
          ===================================================== */}

      <div className="hero hero-expanded">

        <h1>
          Dentists in {cityName}
        </h1>

        <p>
          {citySeo?.intro_paragraph1 ||
            `TexasDentalHub helps patients find dental clinics in ${cityName}, TX.`}
        </p>

        <p>
          {citySeo?.intro_paragraph2 ||
            `Explore local dental services, compare providers, and connect directly with dental offices in the ${cityName} area.`}
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
          onFilter={handleFilter}
        />

      </div>


      {/* =====================================================
          DIRECTORY RESULTS
          ===================================================== */}

      <section className="section directory-results-section">

        {filteredClinics.length > 0 ? (
          <>

            <div className="directory-results-list">

              {visibleClinics.map((clinic) => (

                <ClinicCard
                  key={clinic.id}
                  clinic={clinic}
                />

              ))}

            </div>


            {/* =================================================
                LOAD MORE
                ================================================= */}

            {hasMoreClinics && (

              <div className="directory-load-more">

                <button
                  type="button"
                  className="directory-load-more-button"
                  onClick={handleLoadMore}
                >
                  Load More Dentists
                </button>

                

              </div>

            )}


            {/* Show final count after all results are visible */}

            {!hasMoreClinics &&
              filteredClinics.length > CLINICS_PER_PAGE && (

                <div className="directory-load-more">

                 

                </div>

              )}

          </>
        ) : (

          <div className="directory-empty-state">

            <h3>
              No dentists found in {cityName}
            </h3>

            <p>
              Try adjusting your filters to see more
              dental practices.
            </p>

          </div>

        )}

      </section>


      {/* =====================================================
          CITY FAQs
          ===================================================== */}

      <section className="section city-faq-section">

        <div className="city-faq-heading">

          <h2>
            Frequently Asked Questions About Dentists in{" "}
            {cityName}
          </h2>

          <p>
            Helpful information for finding dental care, comparing
            practices, and requesting an appointment in {cityName}.
          </p>

        </div>


        <div className="city-faq-list">

          {/* ACCEPTING NEW PATIENTS */}

          <details className="city-faq-item">

            <summary>

              <span>
                How can I find a dentist in {cityName} accepting new patients?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                Use the Accepting New Patients option to find dental
                practices in {cityName} that are listed as accepting
                new patients. You can compare ratings, services,
                location, insurance information, and other practice
                details before contacting the dental office. Because
                availability can change, confirm with the practice
                before scheduling.
              </p>

            </div>

          </details>


          {/* EMERGENCY */}

          <details className="city-faq-item">

            <summary>

              <span>
                How can I find an emergency dentist in {cityName}?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                Use the Emergency Appointments option to find dental
                practices in {cityName} listed as offering emergency
                appointments. This does not guarantee immediate or
                same-day availability, so contact the dental office
                to confirm that it can see you and treat your specific
                dental need.
              </p>

            </div>

          </details>


          {/* WEEKENDS */}

          <details className="city-faq-item">

            <summary>

              <span>
                Which dentists in {cityName} are open on weekends?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                Use the Open Weekends option to find dental practices
                in {cityName} listed as offering weekend hours.
                Office schedules can change, so confirm current
                hours and appointment availability directly with
                the dental office before visiting.
              </p>

            </div>

          </details>


          {/* INSURANCE */}

          <details className="city-faq-item">

            <summary>

              <span>
                How can I find a dentist in {cityName} that accepts my insurance?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                Use the Insurance filter to narrow dental practices
                in {cityName} using the insurance information
                available on TexasDentalHub. Insurance participation,
                networks, and coverage can change, so verify your
                specific plan and benefits with the dental office
                or your insurance company before receiving treatment.
              </p>

            </div>

          </details>


          {/* SERVICES */}

          <details className="city-faq-item">

            <summary>

              <span>
                What dental services can I find in {cityName}?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                TexasDentalHub lets you compare {cityName} dental
                practices using the services listed for each office.
                Depending on the practice, these may include general
                dentistry, cosmetic dentistry, orthodontics, dental
                implants, pediatric dentistry, and other dental
                services. Contact the dental office to confirm that
                the specific treatment you need is currently offered.
              </p>

            </div>

          </details>


          {/* APPOINTMENT REQUEST */}

          <details className="city-faq-item">

            <summary>

              <span>
                How does requesting an appointment through TexasDentalHub work?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                When you submit an appointment request through
                TexasDentalHub, it is an appointment request rather
                than a confirmed booking. The dental office should
                confirm availability, the appointment date and time,
                and any other details with you directly.
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
              Explore dental practices in other cities near {cityName}
            </h2>

          </div>


          <div className="city-links-grid">

            {nearbyCities.map((nearbyCity) => (

              <a
                key={nearbyCity.city_slug}
                href={`/dentists/${nearbyCity.city_slug}`}
                className="city-link"
              >

                <span>
                  Dentists in {nearbyCity.city_name}
                </span>

              </a>

            ))}

          </div>

        </section>

      )}

    </div>
  )
}