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
  nearbyCities: { city_name: string; city_slug: string }[]
}) {

  const [filteredClinics, setFilteredClinics] = useState(clinics)

  const featuredClinics = filteredClinics.filter((c) => c.featured === true)
  const regularClinics = filteredClinics.filter((c) => c.featured !== true)

  function trimToMultipleOfThree(list: Clinic[]) {
    if (list.length <= 3) return list
    const remainder = list.length % 3
    return remainder === 0 ? list : list.slice(0, list.length - remainder)
  }

  const trimmedFeatured = trimToMultipleOfThree(featuredClinics)
  const trimmedRegular = trimToMultipleOfThree(regularClinics)

  return (
    <div className="container">

      {/* HERO */}
      <div className="hero hero-expanded">

        <h1>Dentists in {cityName}</h1>

        <p>
          {citySeo?.intro_paragraph1 ||
            `TexasDentalHub helps patients find trusted dental clinics in ${cityName}, TX.`}
        </p>

        <p>
          {citySeo?.intro_paragraph2 ||
            `Explore local dental services, compare providers, and connect directly with dental offices in the ${cityName} area.`}
        </p>

      </div>

      {/* FILTER BAR */}
      


{/* 🔥 ACTION PANEL */}
<div className="search-panel">

  <p className="filter-intent">
    Find dentists by service, insurance, or location:
  </p>

  <FilterBar clinics={clinics} onFilter={setFilteredClinics} />


</div>


      {/* EMPTY FILTER RESULT */}
      {filteredClinics.length === 0 && (
        <div className="section" style={{ textAlign: "left", padding: "10px 0" }}>
          <h3>No dentists found in {cityName}</h3>

          <p style={{ marginTop: "10px", color: "#666" }}>
            Try adjusting your filters to see more clinics.
          </p>
        </div>
      )}

      {/* ⭐ Featured Dentists */}
      {trimmedFeatured.length > 0 && (
        <div className="section">

          <h2 className="featured-title">
            ⭐ Featured Dentists in {cityName}
          </h2>

          <div className="grid">

            {trimmedFeatured.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}

          </div>
        </div>
      )}

      {/* All Dentists */}
      {trimmedRegular.length > 0 && (
        <div className="section">

          <h2 className="all-dentists-title">
            All Dentists in {cityName}
          </h2>

          <div className="grid">

            {trimmedRegular.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}

          </div>
        </div>
      )}

      {/* Internal Linking Cluster */}
      <div className="section city-directory">

        <h3>Explore Dentists in Nearby Cities</h3>

        <div className="city-links-grid">

          {nearbyCities.map((c) => (
            <a
              key={c.city_slug}
              href={`/dentists/${c.city_slug}`}
              className="city-link"
              title={`Dentists in ${c.city_name}`}
            >
              Dentists in {c.city_name}
            </a>
          ))}

        </div>

      </div>

    </div>
  )
}