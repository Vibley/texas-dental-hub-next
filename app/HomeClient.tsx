'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ClinicCard from './components/ClinicCard'
import FilterBar from './components/FilterBar'
import type { Clinic } from '@/app/types'

/* Houston coordinates */
const HOUSTON_LAT = 29.7604
const HOUSTON_LNG = -95.3698

/* Distance calculator */
function getDistance(lat1:number, lon1:number, lat2:number, lon2:number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) *
    Math.sin(dLon/2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export default function HomePage({
  cities,
}: {
  cities: {
    city_name: string
    city_slug: string
    latitude?: number
    longitude?: number
  }[]
}) {

  const [clinics, setClinics] = useState<Clinic[]>([])
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([])

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

  /* Calculate nearby cities */
  const nearbyCities = [...cities]
.filter(c => c.city_slug !== 'houston')
    .map((c:any) => ({
      ...c,
      distance: getDistance(
        HOUSTON_LAT,
        HOUSTON_LNG,
        c.latitude,
        c.longitude
      )
    }))
    .sort((a,b)=>a.distance-b.distance)
    .slice(1,9)
.filter(c => c.distance < 100)

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


{/* Commented out
<div className="hero-cities">
  Looking for dentists in other cities?
  <div className="city-links">
    <a href="/dentists/dallas">Dallas</a>
    <a href="/dentists/austin">Austin</a>
    <a href="/dentists/san-antonio">San Antonio</a>
    <a href="/dentists/fort-worth">Fort Worth</a>
 <a href="/dentists/el-paso">El Paso</a>
 <a href="/dentists/arlington">Arlington</a>
 <a href="/dentists/irving">Irving</a>
 <a href="/dentists/lubbock">Lubbock</a>
 <a href="/dentists/plano">Plano</a>
<a href="/dentists/garland">Garland</a>
  </div>
</div>


<div className="hero-trust">
  <span>✔ 2000+ clinics</span>
  <span>✔ Real Google ratings</span>
  <span>✔ Filter by insurance & services</span>
</div> 
Commented out*/} 

</div> {/* END HERO */}

{/* 🔥 ACTION PANEL */}
<div className="search-panel">

  <p className="filter-intent">
    Find dentists by service, insurance, or location:
  </p>

  <FilterBar
    clinics={clinics}
    onFilter={setFilteredClinics}
  />

</div>

      {/* Filter Bar */}


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