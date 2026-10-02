'use client'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { Clinic } from '@/app/types'

type Props = {
  clinics: Clinic[]
  onFilter: (filtered: Clinic[]) => void
}

export default function FilterBar({
  clinics,
  onFilter,
}: Props) {
  const [serviceFilter, setServiceFilter] =
    useState('')

  const [insuranceFilter, setInsuranceFilter] =
    useState('')

  const [practiceFilter, setPracticeFilter] =
    useState('')

  const [zipFilter, setZipFilter] =
    useState('')

  /* =====================================================
     DYNAMIC FILTER OPTIONS
     ===================================================== */

  const services = useMemo(() => {
    return Array.from(
      new Set(
        (clinics ?? [])
          .flatMap((clinic) => clinic.services || [])
          .filter(Boolean)
      )
    ).sort()
  }, [clinics])

  const insurances = useMemo(() => {
    return Array.from(
      new Set(
        (clinics ?? [])
          .flatMap((clinic) => clinic.insurances || [])
          .filter(Boolean)
      )
    ).sort()
  }, [clinics])

  /* =====================================================
     FILTERING
     ===================================================== */

  useEffect(() => {
    let results = clinics ?? []

    /* SERVICE */

    if (serviceFilter) {
      results = results.filter((clinic) =>
        clinic.services?.includes(serviceFilter)
      )
    }

    /* INSURANCE */

    if (insuranceFilter) {
      results = results.filter((clinic) =>
        clinic.insurances?.includes(insuranceFilter)
      )
    }

    /* PRACTICE OPTIONS */

    if (practiceFilter === 'new-patients') {
      results = results.filter(
        (clinic) =>
          clinic.accepts_new_patients === true
      )
    }

    if (practiceFilter === 'emergency') {
      results = results.filter(
        (clinic) =>
          clinic.emergency_available === true
      )
    }

    if (practiceFilter === 'weekend') {
      results = results.filter(
        (clinic) =>
          clinic.weekend_open
            ?.trim()
            .toLowerCase() === 'yes'
      )
    }

    /* ZIP CODE */

    const normalizedZip = zipFilter.trim()

    if (normalizedZip) {
      results = results.filter((clinic) =>
        clinic.zip?.includes(normalizedZip)
      )
    }

    onFilter(results)
  }, [
    clinics,
    serviceFilter,
    insuranceFilter,
    practiceFilter,
    zipFilter,
    onFilter,
  ])

  /* =====================================================
     RESET
     ===================================================== */

  function clearFilters() {
    setServiceFilter('')
    setInsuranceFilter('')
    setPracticeFilter('')
    setZipFilter('')
  }

  const hasActiveFilters = Boolean(
    serviceFilter ||
      insuranceFilter ||
      practiceFilter ||
      zipFilter
  )

  /* =====================================================
     DISPLAY LABEL FOR PRACTICE FILTER CHIP
     ===================================================== */

  function getPracticeFilterLabel() {
    switch (practiceFilter) {
      case 'new-patients':
        return 'Accepting New Patients'

      case 'emergency':
        return 'Emergency Appointments'

      case 'weekend':
        return 'Open Weekends'

      default:
        return ''
    }
  }

  /* =====================================================
     UI
     ===================================================== */

  return (
    <div className="filter-wrapper">

      <div className="filter-row">

        {/* SERVICE */}

        <select
          aria-label="Filter by dental service"
          value={serviceFilter}
          onChange={(e) =>
            setServiceFilter(e.target.value)
          }
        >
          <option value="">
            All Services
          </option>

          {services.map((service) => (
            <option
              key={service}
              value={service}
            >
              {service}
            </option>
          ))}
        </select>


        {/* INSURANCE */}

        <select
          aria-label="Filter by insurance"
          value={insuranceFilter}
          onChange={(e) =>
            setInsuranceFilter(e.target.value)
          }
        >
          <option value="">
            All Insurance
          </option>

          {insurances.map((insurance) => (
            <option
              key={insurance}
              value={insurance}
            >
              {insurance}
            </option>
          ))}
        </select>


        {/* PRACTICE OPTIONS */}

        <select
          aria-label="Filter by practice options"
          value={practiceFilter}
          onChange={(e) =>
            setPracticeFilter(e.target.value)
          }
        >
          <option value="">
            Practice Options
          </option>

          <option value="new-patients">
            Accepting New Patients
          </option>

          <option value="emergency">
            Emergency Appointments
          </option>

          <option value="weekend">
            Open Weekends
          </option>
        </select>


        {/* ZIP CODE */}

        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          aria-label="Filter by ZIP code"
          placeholder="ZIP Code"
          value={zipFilter}
          onChange={(e) => {
            const value =
              e.target.value.replace(/\D/g, '')

            setZipFilter(value)
          }}
        />

      </div>


      {/* =================================================
          ACTIVE FILTERS
          ================================================= */}

      {hasActiveFilters && (
        <div className="active-filters">

          {serviceFilter && (
            <span className="filter-chip">

              {serviceFilter}

              <button
                type="button"
                aria-label={`Remove ${serviceFilter} filter`}
                onClick={() =>
                  setServiceFilter('')
                }
              >
                ×
              </button>

            </span>
          )}


          {insuranceFilter && (
            <span className="filter-chip">

              {insuranceFilter}

              <button
                type="button"
                aria-label={`Remove ${insuranceFilter} filter`}
                onClick={() =>
                  setInsuranceFilter('')
                }
              >
                ×
              </button>

            </span>
          )}


          {practiceFilter && (
            <span className="filter-chip">

              {getPracticeFilterLabel()}

              <button
                type="button"
                aria-label="Remove practice option filter"
                onClick={() =>
                  setPracticeFilter('')
                }
              >
                ×
              </button>

            </span>
          )}


          {zipFilter && (
            <span className="filter-chip">

              ZIP: {zipFilter}

              <button
                type="button"
                aria-label="Remove ZIP code filter"
                onClick={() =>
                  setZipFilter('')
                }
              >
                ×
              </button>

            </span>
          )}


          <button
            type="button"
            className="clear-filters"
            onClick={clearFilters}
          >
            Reset all filters
          </button>

        </div>
      )}

    </div>
  )
}