"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FilterBar from "@/app/components/FilterBar"
import CardCTA from "@/app/components/CardCTA"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

import type { Clinic } from '@/app/types'

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

  return (
    <div className="container">

      {/* HERO */}
    <div className="hero hero-expanded">

  <h3>Dentists in {cityName}, TX</h3>


  <p>
    Finding a trusted dentist in {cityName} doesn’t have to be complicated.
    TexasDentalHub connects patients with verified local dental clinics
    offering general, family, cosmetic, and emergency dental care throughout
    the {cityName} area.
  </p>

  <p>
    Whether you’re new to the {cityName} or simply looking for a better dental
    provider, our directory makes it easy to discover nearby clinics,
    explore available services, and contact dental offices directly —
    without third-party booking fees or misleading listings.
  </p>

  <p>
    Every clinic listed on TexasDentalHub is reviewed for accuracy and
    location, helping patients find reliable dental care within their
    local community. We focus on real providers serving {cityName}
    and surrounding neighborhoods, not national lead-generation networks.
  </p>

  <p>
    Common dental services offered by {cityName} clinics include preventive
    care, routine cleanings, fillings, cosmetic dentistry, emergency dental
    treatment, and family dental care.
  </p>

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

              {/* 🔥 Unified CTA Logic */}
              <CardCTA
                phone={clinic.phone}
                city={city}
                clinicName={clinic.name}
              />

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}