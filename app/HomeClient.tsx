'use client'

import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
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

  // Initialized from server-fetched prop — no useEffect needed
  const [clinics, setClinics] = useState<Clinic[]>(initialClinics)
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>(initialClinics)

  const featuredClinics = filteredClinics.filter((c) => c.featured === true)
  const regularClinics = filteredClinics.filter((c) => c.featured !== true)

  const featuredToShow = featuredClinics.slice(
    0,
    Math.floor(featuredClinics.length / 3) * 3
  )
  const regularToShow = regularClinics.slice(
    0,
    Math.floor(regularClinics.length / 3) * 3
  )

  // Memoized so it doesn't recalculate on every render
  const nearbyCities = useMemo(() => {
    return [...cities]
      .filter((c) => c.city_slug !== 'houston')
      .map((c: City) => ({
        ...c,
        distance: getDistance(
          HOUSTON_LAT,
          HOUSTON_LNG,
          c.latitude ?? 0,
          c.longitude ?? 0
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8) // Fixed: was .slice(1, 9) which skipped the closest city
      .filter((c) => c.distance < 100)
  }, [cities])

  return (
    <>
      {/* Hero */}
      <div className="hero hero-expanded">

        <h2>Find Top-Rated Dentists in Houston, TX</h2>

        <p className="hero-subtext">
          Browse verified dental clinics in Houston with real patient reviews,
          services, and accepted insurance plans.
        </p>

        <p className="hero-subtext">
          Whether you need a family dentist, emergency care, cosmetic dentistry,
          or dental implants — find the right provider near you.
        </p>

      </div>

      {/* Action Panel */}
      <div className="search-panel">

        <p className="filter-intent">
          Find dentists by service, insurance, or location:
        </p>

        <FilterBar
          clinics={clinics}
          onFilter={setFilteredClinics}
        />

      </div>

      {/* Empty Filter Result */}
      {filteredClinics.length === 0 && (
        <div className="section" style={{ textAlign: 'left', padding: '10px 0' }}>
          <h3>No dentists found in Houston</h3>
          <p style={{ marginTop: '10px', color: '#666' }}>
            Try adjusting your filters to see more clinics.
          </p>
        </div>
      )}

      {/* Featured Dentists */}
      {featuredClinics.length > 0 && (
        <div className="section">

          <h2 className="featured-title">
            ⭐ Featured Dentists in Houston
          </h2>

          <div className="grid">
            {featuredToShow.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>

        </div>
      )}

      {/* All Dentists */}
      {regularClinics.length > 0 && (
        <div className="section">

          <h2 className="all-dentists-title">
            All Dentists in Houston
          </h2>

          <div className="grid">
            {regularToShow.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>

        </div>
      )}

      {/* Nearby Cities */}
      <div className="section city-directory">

        <h3>Dentists Near Houston</h3>

        <div className="city-links-grid">
          {nearbyCities.map((c) => (
            <a
              key={c.city_slug}
              href={`/dentists/${c.city_slug}`}
              className="city-link"
              title={`Dentists in ${c.city_name}`}
              aria-label={`Dentists in ${c.city_name}`}
            >
              Dentists in {c.city_name}
            </a>
          ))}
        </div>

      </div>
    </>
  )
}
