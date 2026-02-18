'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ClinicCard from './components/ClinicCard'
import FilterBar from './components/FilterBar'
import type { Clinic } from '@/app/types'


export default function HomePage() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([])
  const [services, setServices] = useState<string[]>([])
  const [insurances, setInsurances] = useState<string[]>([])

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

    // Extract unique services
    const allServices = new Set<string>()
    const allInsurances = new Set<string>()

    data.forEach((clinic: any) => {
      if (Array.isArray(clinic.services)) {
        clinic.services.forEach((s: string) => allServices.add(s))
      }

      if (Array.isArray(clinic.insurances)) {
        clinic.insurances.forEach((i: string) => allInsurances.add(i))
      }
    })

    setServices(Array.from(allServices).sort())
    setInsurances(Array.from(allInsurances).sort())
  }

  function handleFilter({
    service,
    insurance,
    zip,
  }: {
    service: string
    insurance: string
    zip: string
  }) {
    let results = [...clinics]

    if (service) {
      results = results.filter((c) =>
        c.services?.includes(service)
      )
    }

    if (insurance) {
      results = results.filter((c) =>
        c.insurances?.includes(insurance)
      )
    }

    if (zip) {
      results = results.filter((c) =>
        c.zip?.includes(zip)
      )
    }

    setFilteredClinics(results)
  }

  return (
    <>
      {/* Hero */}
    <div className="hero hero-expanded">

  <h3>Find Trusted Dentists in Texas</h3>

  <p className="hero-sub">
    TexasDentalHub is a locally focused dental directory helping patients discover verified dental clinics throughout Houston, Katy, Sugar Land, The Woodlands, and nearby Texas communities.
  </p>

  <p>
    Finding a reliable dentist shouldn’t mean sorting through misleading listings or national booking platforms. Our directory connects patients directly with real local dental offices offering general, family, cosmetic, and emergency dental care — with no hidden fees or third-party intermediaries.
  </p>

  <p>
   Whether you're searching for a new provider in Houston or exploring options in nearby cities, TexasDentalHub makes it simple to compare clinics, review available services, and contact offices directly.
  </p>

  <p>
  Every clinic listed is reviewed for location accuracy and relevance, helping patients confidently choose trusted dental care within their own communities.
  </p>

  <p>
    Common services offered by Texas dental clinics include preventive
    cleanings, fillings, cosmetic dentistry, emergency treatment,
    family dental care, and restorative procedures.
  </p>

</div>



      {/* Filters */}

   <FilterBar
  clinics={clinics}
  onFilter={setFilteredClinics}
/>


      {/* Clinics */}
   <div className="grid">
  {filteredClinics.map((clinic) => (
    <ClinicCard key={clinic.id} clinic={clinic} />
  ))}
</div>
    </>
  )
}