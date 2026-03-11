'use client'

import { useState, useMemo, useEffect } from 'react'
import type { Clinic } from '@/app/types'

type Props = {
  clinics: Clinic[]
  onFilter: (filtered: Clinic[]) => void
}

export default function FilterBar({ clinics, onFilter }: Props) {
  const [serviceFilter, setServiceFilter] = useState('')
  const [insuranceFilter, setInsuranceFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [zipFilter, setZipFilter] = useState('')

  /* =============================
     Extract Dynamic Options
  ============================== */

  const services = useMemo(() => {
    return Array.from(
      new Set((clinics ?? []).flatMap(c => c.services || []))
    ).sort()
  }, [clinics])

  const insurances = useMemo(() => {
    return Array.from(
      new Set((clinics ?? []).flatMap(c => c.insurances || []))
    ).sort()
  }, [clinics])

  /* =============================
     Filtering Logic
  ============================== */

  useEffect(() => {
    let results = clinics ?? []

    if (serviceFilter) {
      results = results.filter(c =>
        c.services?.includes(serviceFilter)
      )
    }

    if (insuranceFilter) {
      results = results.filter(c =>
        c.insurances?.includes(insuranceFilter)
      )
    }

    if (availabilityFilter === 'weekend') {
      results = results.filter(
        c => c.weekend_open === 'YES'
      )
    }

    if (zipFilter) {
      results = results.filter(c =>
        c.zip?.includes(zipFilter)
      )
    }

    onFilter(results)

  }, [
    clinics,
    serviceFilter,
    insuranceFilter,
    availabilityFilter,
    zipFilter,
    onFilter,
  ])

  /* =============================
     Reset Filters
  ============================== */

  function clearFilters() {
    setServiceFilter('')
    setInsuranceFilter('')
    setAvailabilityFilter('')
    setZipFilter('')
  }

  const hasActiveFilters =
    serviceFilter ||
    insuranceFilter ||
    availabilityFilter ||
    zipFilter

  /* =============================
     UI
  ============================== */

  return (
    <div className="filter-wrapper">

      <div className="filter-row">

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
        >
          <option value="">All Services</option>
          {services.map(service => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>

        <select
          value={insuranceFilter}
          onChange={(e) => setInsuranceFilter(e.target.value)}
        >
          <option value="">All Insurance</option>
          {insurances.map(ins => (
            <option key={ins} value={ins}>
              {ins}
            </option>
          ))}
        </select>

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
        >
          <option value="">Any Availability</option>
          <option value="weekday">Open Weekdays</option>
          <option value="weekend">Open Weekends</option>
        </select>

        <input
          type="text"
          placeholder="ZIP Code"
          value={zipFilter}
          onChange={(e) => setZipFilter(e.target.value)}
        />

     

      </div>

      {/* =============================
         Active Filter Chips
      ============================== */}

      {hasActiveFilters && (
        <div className="active-filters">

          {serviceFilter && (
            <span className="filter-chip">
              {serviceFilter}
              <button onClick={() => setServiceFilter('')}>
                ×
              </button>
            </span>
          )}

          {insuranceFilter && (
            <span className="filter-chip">
              {insuranceFilter}
              <button onClick={() => setInsuranceFilter('')}>
                ×
              </button>
            </span>
          )}

          {availabilityFilter && (
            <span className="filter-chip">
              {availabilityFilter}
              <button onClick={() => setAvailabilityFilter('')}>
                ×
              </button>
            </span>
          )}

          {zipFilter && (
            <span className="filter-chip">
              ZIP: {zipFilter}
              <button onClick={() => setZipFilter('')}>
                ×
              </button>
            </span>
          )}


   {hasActiveFilters && (
          <button
            className="clear-filters"
            onClick={clearFilters}
          >
            Reset all filters
          </button>
        )}

        </div>
      )}

    </div>
  )
}