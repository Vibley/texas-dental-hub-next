"use client"

import { useState } from "react"
import FilterBar from "@/app/components/FilterBar"
import ClinicCard from "@/app/components/ClinicCard"
import type { Clinic } from "@/app/types"

type CitySeo = {
  intro_paragraph1: string | null
  intro_paragraph2: string | null
  meta_title: string | null
  meta_description: string | null
}

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

  return (
    <div className="container">

      {/* =====================================================
          HERO
          ===================================================== */}

      <div className="hero hero-expanded">

        <h2>
          Dentists in {cityName}
        </h2>

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
          onFilter={setFilteredClinics}
        />

      </div>


      {/* =====================================================
          DIRECTORY RESULTS
          ===================================================== */}

      <section className="section directory-results-section">

        <div className="directory-results-heading">

         <h2>Dentists in {cityName}</h2>

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
            Find answers about new-patient availability,
            emergency dental care, weekend hours, insurance,
            and finding dental practices in {cityName}.
          </p>

        </div>


        <div className="city-faq-list">

          {/* ACCEPTING NEW PATIENTS */}

          <details className="city-faq-item">

            <summary>

              <span>
                How can I find a dentist in {cityName}{" "}
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
                find {cityName} dental practices marked as
                accepting new patients. You can then compare
                ratings, services, location, and other
                practice information before contacting the
                dental office directly.
              </p>

            </div>

          </details>


          {/* EMERGENCY */}

          <details className="city-faq-item">

            <summary>

              <span>
                How can I find an emergency dentist in{" "}
                {cityName}?
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
                find {cityName} dental practices listed as
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
                Which dentists in {cityName} are open on
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
                Use the Open Weekends option to find{" "}
                {cityName} dental practices listed as
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
                Can I search {cityName} dentists by
                insurance?
              </span>

              <span
                className="city-faq-icon"
                aria-hidden="true"
              >
              </span>

            </summary>

            <div className="city-faq-answer">

              <p>
                Yes. Use the Insurance filter to compare{" "}
                {cityName} dental practices using available
                insurance information. Because participation
                and coverage can change, confirm your
                specific plan with the dental office or your
                insurance company before scheduling
                treatment.
              </p>

            </div>

          </details>


          {/* SERVICES */}

          <details className="city-faq-item">

            <summary>

              <span>
                Can I search dentists in {cityName} by
                dental service?
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
                list of {cityName} dental practices using
                the service information available on
                TexasDentalHub. Review the practice details
                and contact the dental office directly to
                confirm that the specific treatment you
                need is currently offered.
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

            {nearbyCities.map((nearbyCity) => (

              <a
                key={nearbyCity.city_slug}
                href={`/dentists/${nearbyCity.city_slug}`}
                className="city-link"
              >

                <span>
                  Dentists in {nearbyCity.city_name}
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

    </div>
  )
}