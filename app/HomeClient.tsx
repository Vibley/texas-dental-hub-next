'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ClinicCard from './components/ClinicCard'
import FilterBar from './components/FilterBar'
import type { Clinic } from '@/app/types'

export default function HomePage({
  cities,
}: {
  cities: { city_name: string; city_slug: string }[]
}) {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([])

  const featuredClinics = filteredClinics.filter((c) => c.featured === true)
  const regularClinics = filteredClinics.filter((c) => c.featured !== true)

  useEffect(() => {
    loadHoustonClinics()
  }, [])

  async function loadHoustonClinics() {
    const { data } = await supabase
      .from('clinics')
      .select('*')
      .ilike('city', '%houston%')

    if (!data) return

    setClinics(data)
    setFilteredClinics(data)
  }

  return (
    <>
      {/* Hero */}

      <div className="hero hero-expanded">

        <h1>Comprehensive Dental Care Across Houston</h1>

        <p>
          Finding a trusted dentist in Houston doesn’t have to be complicated.
          TexasDentalHub connects patients with verified local dental clinics
          offering general, family, cosmetic, and emergency dental care
          throughout the Houston area.
        </p>

        <details className="hero-details">
          <summary className="hero-summary">
            Learn more about Houston dental services
          </summary>

          <div className="hero-content">

            <h2>Family Dentists in Houston</h2>
            <p>
              Family dental clinics provide routine cleanings, fillings,
              crowns, fluoride treatments, and long-term oral health care.
            </p>

            <h2>Emergency Dentists in Houston</h2>
            <p>
              Dental emergencies such as severe tooth pain, broken teeth,
              abscesses, and knocked-out teeth require immediate attention.
            </p>

            <h2>Cosmetic & Implant Dentistry in Houston</h2>
            <p>
              Cosmetic procedures including Invisalign, veneers,
              professional whitening, and dental implants are widely available.
            </p>

            <h2>Insurance & Payment Options</h2>
            <p>
              Most Houston dental clinics accept major PPO insurance plans
              and may offer financing options for cosmetic or implant procedures.
            </p>

          </div>
        </details>

      </div>

      {/* Filter Bar */}

      <FilterBar
        clinics={clinics}
        onFilter={setFilteredClinics}
      />

      {/* EMPTY FILTER RESULT */}

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
            {featuredClinics.map((clinic) => (
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
            {regularClinics.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>

        </div>
      )}

      {/* Explore Cities */}

      <div className="section city-directory">

        <h2>Explore Dentists in Nearby Cities</h2>

        <div className="city-links-grid">

          {cities?.map((c) => (
            <a
              key={c.city_slug}
              href={`/dentists/${c.city_slug}`}
              className="city-link"
              title={`Dentists in ${c.city_name}`}
              aria-label={`Dentists in ${c.city_name}`}
            >
              {c.city_name}
            </a>
          ))}

        </div>

      </div>

    </>
  )
}