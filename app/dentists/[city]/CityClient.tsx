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

export default function CityClient({
  city,
  cityName,
  clinics,
}: {
  city: string
  cityName: string
  clinics: Clinic[]
}) {
  const router = useRouter()
  const [filteredClinics, setFilteredClinics] = useState(clinics)

  // 🔥 Houston Metro Internal Linking Cluster
  const metroCities = [
    "Houston",
    "Katy",
    "Sugar Land",
    "Cypress",
    "Pearland",
    "The Woodlands",
    "League City",
    "Missouri City",
    "Richmond",
    "Rosenberg"
    
  ]

  return (
    <div className="container">

      {/* HERO */}
      <div className="hero hero-expanded">

        {cityName !== "Houston" && (
          <>
            <h2>Dentists in {cityName}, TX</h2>

            <p>
              Finding a trusted dentist in {cityName} doesn’t have to be complicated.
              TexasDentalHub connects patients with verified local dental clinics
              offering general, family, cosmetic, and emergency dental care throughout
              the {cityName} area.
            </p>

            <p>
              Whether you’re new to {cityName} or simply looking for a better dental
              provider, our directory makes it easy to discover nearby clinics,
              explore available services, and contact dental offices directly —
              without third-party booking fees or misleading listings.
            </p>
          </>
        )}

        {cityName === "Houston" && (
          <>
            <h2>Comprehensive Dental Care Across Houston</h2>

            <p>
              Finding a trusted dentist in Houston doesn’t have to be complicated.
              TexasDentalHub connects patients with verified local dental clinics
              offering general, family, cosmetic, and emergency dental care
              throughout the Houston area.
            </p>

            <p>
              As one of the largest metropolitan areas in Texas, Houston serves
              diverse communities across neighborhoods such as The Heights,
              Midtown, Galleria, Westchase, Katy, Sugar Land, Cypress,
              Pearland, and The Woodlands.
            </p>

            <h2>Family Dentists in Houston</h2>
            <p>
              Family dental clinics provide routine cleanings, fillings, crowns,
              fluoride treatments, and long-term oral health care for children
              and adults. Many Houston practices offer flexible scheduling.
            </p>

            <h2>Emergency Dentists in Houston</h2>
            <p>
              Dental emergencies such as severe tooth pain, broken teeth,
              abscesses, and knocked-out teeth require immediate attention.
              Many Houston dental offices provide same-day emergency appointments.
            </p>

            <h2>Cosmetic & Implant Dentistry in Houston</h2>
            <p>
              Cosmetic procedures including Invisalign, veneers,
              professional whitening, and dental implants are widely available
              throughout Houston.
            </p>

            <h2>Insurance & Payment Options</h2>
            <p>
              Most Houston dental clinics accept major PPO insurance plans.
              Use the insurance filter below to find clinics that match your plan.
            </p>
          </>
        )}
      </div>

      {/* FILTER BAR */}
      <FilterBar
        clinics={clinics}
        onFilter={setFilteredClinics}
      />

      {/* GRID */}
      <div className="section">
        <div className="grid">
          {filteredClinics.map((clinic) => (
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
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`}
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

      {/* 🔥 Internal Linking Cluster */}
      <div className="section nearby-cities" style={{ textAlign: "center", paddingTop: "6px"}}>
        <h3>Explore Dentists in Nearby Cities</h3>

        <div className="city-links">
          {metroCities
            .filter((c) => c !== cityName)
            .map((c) => (
              <a
                key={c}
                href={`/dentists/${slugify(c)}`}
                className="city-link"
              >
                {c}
              </a>
            ))}
        </div>
      </div>

    </div>
  )
}