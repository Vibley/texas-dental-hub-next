'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type City = {
  city_name: string
  city_slug: string
}

export default function CitySearch({ cities }: { cities: City[] }) {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<City[]>([])
  const [highlightIndex, setHighlightIndex] = useState(-1)

  function handleChange(value: string) {
    setQuery(value)

    if (value.length < 2) {
      setResults([])
      return
    }

    const filtered = cities
      .filter((city) =>
        city.city_name.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 8)

    setResults(filtered)
    setHighlightIndex(-1)
  }

  function selectCity(city: City) {
    setQuery('')
    setResults([])
    router.push(`/dentists/${city.city_slug}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      )
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      )
    }

    if (e.key === 'Enter') {
      if (highlightIndex >= 0) {
        selectCity(results[highlightIndex])
      }
    }

    if (e.key === 'Escape') {
      setResults([])
    }
  }

  return (
    <div className="city-search">

      <input
        type="text"
        placeholder="Search city"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="city-search-input"
      />

      {results.length > 0 && (
        <div className="city-search-dropdown">

          {results.map((city, index) => (
            <div
              key={city.city_slug}
              className={`city-search-item ${
                index === highlightIndex ? 'active' : ''
              }`}
              onClick={() => selectCity(city)}
            >
              {city.city_name}
            </div>
          ))}

        </div>
      )}

    </div>
  )
}