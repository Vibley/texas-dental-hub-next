'use client'

import { useRouter } from 'next/navigation'

function toCityKey(city: string) {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function CitySelector({ cities }: { cities: string[] }) {
  const router = useRouter()

  return (
    <select
      className="city-select"
      onChange={(e) => {
        if (e.target.value) {
          router.push(`/dentists/${toCityKey(e.target.value)}-tx`)
        }
      }}
    >
      <option value="">Houston</option>
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  )
}