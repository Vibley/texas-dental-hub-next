'use client'

import { useRouter } from 'next/navigation'
import CitySearch from './CitySearch'

function toCityKey(city: string) {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function TexasIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8L8 3L14 3L21 10L17 14L18 18L13 21L9 18L6 19L5 14L3 12Z" />
    </svg>
  )
}

export default function Header({ cities }: { cities: string[] }) {
  const router = useRouter()

  return (
    <div className="topbar">
      <div className="topbar-inner">

       <a href="/" className="brand">
  <img
    src="/brand/texas-outline.svg"
    alt=""
    className="brand-icon"
    aria-hidden="true"
  />

  <div className="brand-text">
    <div className="brand-main">
      <span className="brand-name">TexasDental</span>
      <span className="brand-hub">Hub</span>
    </div>
    
  </div>
</a>
      <div className="city-search-wrapper">
  <CitySearch
    cities={cities.map((c) => ({
      city_name: c,
      city_slug: toCityKey(c),
    }))}
  />
</div>  



      </div>
    </div>
  )
}