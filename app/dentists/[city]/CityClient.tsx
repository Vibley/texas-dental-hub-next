"use client"

import { useMemo, useState } from "react"
import FilterBar from "@/app/components/FilterBar"
import ClinicCard from "@/app/components/ClinicCard"
import type { Clinic } from "@/app/types"

type CitySeo = {
  intro_paragraph1: string | null
  intro_paragraph2: string | null
  meta_title: string | null
  meta_description: string | null
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
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

  const featuredClinics = filteredClinics.filter(
    (clinic) => clinic.featured === true
  )

  const regularClinics = filteredClinics.filter(
    (clinic) => clinic.featured !== true
  )

  const topRatedClinics = useMemo(() => {
    return [...filteredClinics]
      .filter(
        (clinic) =>
          typeof clinic.google_rating === "number" &&
          typeof clinic.google_review_count === "number" &&
          clinic.google_rating >= 4.5 &&
          clinic.google_review_count >= 50
      )
      .sort((a, b) => {
        const ratingDifference =
          (b.google_rating ?? 0) -
          (a.google_rating ?? 0)

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

  return (
    <div className="container">

      {/* HERO */}
      <div className="hero hero-expanded">

        <h2>Dentists in {cityName}</h2>

        <p>
          {citySeo?.intro_paragraph1 ||
            `TexasDentalHub helps patients find dental clinics in ${cityName}, TX.`}
        </p>

        <p>
          {citySeo?.intro_paragraph2 ||
            `Explore local dental services, compare providers, and connect directly with dental offices in the ${cityName} area.`}
        </p>

      </div>

      {/* SEARCH / FILTER PANEL */}
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
              Top-Rated Dental Practices in {cityName}
            </h2>

            <p className="top-rated-intro">
              Compare highly rated {cityName} dental practices using
              Google ratings and review counts.
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
                      href={`/dentists/${city}/${slugify(
                        clinic.name
                      )}`}
                    >
                      {clinic.name}
                    </a>
                  </h3>

                  <div className="top-rated-rating">

                    ⭐ {clinic.google_rating?.toFixed(1)}

                    {clinic.google_review_count != null && (
                      <span>
                        {" "}
                        (
                        {clinic.google_review_count.toLocaleString()}{" "}
                        Google reviews)
                      </span>
                    )}

                  </div>

                  <a
                    href={`/dentists/${city}/${slugify(
                      clinic.name
                    )}`}
                    className="top-rated-profile-link"
                  >
                    View Practice →
                  </a>

                </div>

              </div>
            ))}

          </div>

          <p className="top-rated-methodology">
            Top-rated selections are based on Google ratings and
            review counts. Featured status does not affect rankings.
          </p>

        </section>
      )}

      {/* EMPTY FILTER RESULT */}
      {filteredClinics.length === 0 && (
        <div
          className="section"
          style={{
            textAlign: "left",
            padding: "10px 0",
          }}
        >

          <h3>
            No dentists found in {cityName}
          </h3>

          <p
            style={{
              marginTop: "10px",
              color: "#666",
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
            ⭐ Featured Dentists in {cityName}
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
            All Dentists in {cityName}
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

      {/* CITY FAQs */}
<section className="section city-faq-section">

  <div className="city-faq-heading">
    <h2>
      Frequently Asked Questions About Dentists in {cityName}
    </h2>

    <p>
      Find answers about appointments, emergency dental care,
      weekend availability, insurance, and how practices are
      displayed on TexasDentalHub.
    </p>
  </div>

  <div className="city-faq-list">

    <details className="city-faq-item">
      <summary>
        <span>
          How can I find a dentist in {cityName} accepting new patients?
        </span>

        <span className="city-faq-icon" aria-hidden="true">
          
        </span>
      </summary>

      <div className="city-faq-answer">
        <p>
          Use the Accepting New Patients filter to find {cityName}
          dental practices marked as accepting new patients. You can
          then compare ratings, services, location, and other practice
          information before contacting the dental office directly.
        </p>
      </div>
    </details>


    <details className="city-faq-item">
      <summary>
        <span>
          How can I find an emergency dentist in {cityName}?
        </span>

        <span className="city-faq-icon" aria-hidden="true">
          
        </span>
      </summary>

      <div className="city-faq-answer">
        <p>
          Use the Emergency filter to find {cityName} dental practices
          listed as offering emergency appointments. Contact the clinic
          directly to confirm current availability and whether it can
          treat your specific dental need.
        </p>
      </div>
    </details>


    <details className="city-faq-item">
      <summary>
        <span>
          Which dentists in {cityName} are open on weekends?
        </span>

        <span className="city-faq-icon" aria-hidden="true">
          
        </span>
      </summary>

      <div className="city-faq-answer">
        <p>
          Use the Open Weekends filter to find {cityName} dental
          practices listed as offering weekend hours. Office schedules
          can change, so confirm current hours directly with the clinic
          before visiting.
        </p>
      </div>
    </details>


    <details className="city-faq-item">
      <summary>
        <span>
          Can I search {cityName} dentists by insurance?
        </span>

        <span className="city-faq-icon" aria-hidden="true">
          
        </span>
      </summary>

      <div className="city-faq-answer">
        <p>
          Yes. Use the Insurance filter to compare {cityName} dental
          practices using available insurance information. Because
          participation and coverage can change, confirm your specific
          plan with the dental office or your insurance company before
          scheduling treatment.
        </p>
      </div>
    </details>


    <details className="city-faq-item">
      <summary>
        <span>
          How are Top-Rated dental practices in {cityName} selected?
        </span>

        <span className="city-faq-icon" aria-hidden="true">
          
        </span>
      </summary>

      <div className="city-faq-answer">
        <p>
          Top-Rated practices are selected from eligible TexasDentalHub
          listings with a Google rating of 4.5 or higher and at least
          50 Google reviews. Practices are ordered by Google rating,
          with review count used when ratings are equal. Featured
          listing status does not affect the ranking.
        </p>
      </div>
    </details>

  </div>

</section>

  {/* NEARBY CITIES */}
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