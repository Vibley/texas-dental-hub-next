'use client'

import { useRouter } from 'next/navigation'

function toCityKey(city: string) {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function Header({ cities }: { cities: string[] }) {
  const router = useRouter()

  return (
    <div className="topbar">
      <div className="topbar-inner">

        <a href="/" className="brand">
          <span className="brand-name">TexasDental</span>
          <span className="brand-hub">Hub</span>
        </a>

        <select
          className="city-select"
          onChange={(e) => {
            if (!e.target.value) return
            router.push(`/dentists/${toCityKey(e.target.value)}-tx`)
          }}
        >
          <option value="">Houston</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

      </div>
    </div>
  )
}