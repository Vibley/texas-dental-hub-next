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
  Pearland, and The Woodlands. Patients can compare experienced
  providers offering preventive, restorative, cosmetic,
  and emergency dental treatments near their home or workplace.
</p>

            <h2>Family Dentists in Houston</h2>
            <p>
              Family dental clinics provide routine cleanings, fillings,
              crowns, fluoride treatments, and long-term oral health care
              for children and adults. Many Houston practices offer
              flexible scheduling and bilingual staff.
            </p>

            <h2>Emergency Dentists in Houston</h2>
            <p>
              Dental emergencies such as severe tooth pain, broken teeth,
              abscesses, and knocked-out teeth require immediate attention.
              Many Houston dental offices provide same-day emergency
              appointments and rapid pain relief.
            </p>

            <h2>Cosmetic & Implant Dentistry in Houston</h2>
            <p>
              Cosmetic procedures including Invisalign, veneers,
              professional whitening, and dental implants are widely
              available throughout Houston. Many clinics use modern
              digital imaging and advanced restorative techniques.
            </p>

            <h2>Insurance & Payment Options</h2>
           <p>
  Most Houston dental clinics accept major PPO insurance plans and may offer
  flexible financing options for cosmetic or implant procedures. To find
  clinics that match your specific plan, select your insurance provider
  from the filter dropdown below.
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