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

   
        <h1>Find Trusted Dentists in Houston, TX</h1>

<p>
    TexasDentalHub helps patients discover trusted dentists across the
    Houston metropolitan area. Our directory includes dentists serving communities across Greater Houston, including Katy, Sugar Land, Pearland, Cypress, The Woodlands, League City, Missouri City, Richmond, Rosenberg, Spring, Tomball, and nearby neighborhoods.
</p>
 <p>
   Whether you are searching for a family dentist, cosmetic dentist,
emergency dental care, or dental implants, you can explore verified
Houston dental clinics and connect directly with local providers.
  </p>

<p className="hero-cta">
  Browse dentists below or use the filters to find clinics
  offering the services and insurance plans you need.
</p>


        <details className="hero-details">
          <summary className="hero-summary">
            Explore dental services available in Houston
          </summary>

          <div className="hero-content">

            <h2>Family Dentists in Houston</h2>
<p>
  Family dentists in Houston provide routine cleanings, fillings,
  crowns, fluoride treatments, and preventive dental care for
  children and adults. Many dental clinics offer flexible
  scheduling and comprehensive oral health services designed
  to support long-term dental wellness.
</p>

            <h2>Emergency Dentists in Houston</h2>
           <p>
  Dental emergencies such as severe tooth pain, broken teeth,
  infections, abscesses, or knocked-out teeth require immediate
  attention. Many Houston dental clinics provide same-day emergency
  appointments to relieve pain and prevent further complications.
</p>

            <h2>Cosmetic & Implant Dentistry in Houston</h2>
          <p>
  Cosmetic dental services including Invisalign, porcelain veneers,
  professional teeth whitening, and dental implants are widely
  available across Houston. Many clinics use modern digital imaging
  and advanced restorative techniques to improve both function
  and appearance.
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

        <h2>Find Dentists in Nearby Houston Cities</h2>

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