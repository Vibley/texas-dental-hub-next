
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FilterBar from "@/app/components/FilterBar"
import CardCTA from "@/app/components/CardCTA"
import type { Clinic } from "@/app/types"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

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
  const router = useRouter()
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
      <FilterBar clinics={clinics} onFilter={setFilteredClinics} />

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
              <div
                key={clinic.id}
                className="card featured-card"
                onClick={() =>
                  router.push(
                    `/dentists/${city}/clinic/${slugify(clinic.name)}`
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <span className="badge featured-badge">⭐ Featured</span>

                <h3>{clinic.name}</h3>

                {clinic.address && (
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
                )}

                <CardCTA
                  phone={clinic.phone}
                  city={city}
                  clinicName={clinic.name}
                />
              </div>
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
              <div
                key={clinic.id}
                className="card"
                onClick={() =>
                  router.push(
                    `/dentists/${city}/clinic/${slugify(clinic.name)}`
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <span className="badge">Clinic</span>

                <h3>{clinic.name}</h3>

                {clinic.address && (
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
                )}

                <CardCTA
                  phone={clinic.phone}
                  city={city}
                  clinicName={clinic.name}
                />
              </div>
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