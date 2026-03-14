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

   
        <h1>Find Trusted Dentists Across Texas</h1>

<p>
TexasDentalHub helps patients discover trusted dental clinics across Texas.
Our directory includes dentists serving major Texas cities including Houston,
Dallas, Austin, San Antonio, Fort Worth, and surrounding communities.
</p>

<p>
Whether you are searching for a family dentist, cosmetic dentist,
emergency dental care, or dental implants, you can explore verified
dental clinics and connect directly with local dental providers.
</p>

<p className="hero-cta">
  Browse dentists below or use the filters to find clinics
  offering the services and insurance plans you need.
</p>


      

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

        <h2>Explore Dentists by Texas City</h2>

        <div className="city-links-grid">

          {cities?.map((c) => (
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