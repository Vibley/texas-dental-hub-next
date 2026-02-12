import { supabase } from '@/lib/supabase'

/* ---------- Helpers ---------- */

function cleanCity(city: string) {
  return city.replace('-tx', '').replace(/-/g, ' ')
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/* ---------- Opening Hours Parser ---------- */
function normalizeHours(hours: any): string | undefined {
  if (!hours) return undefined

  // Already a string
  if (typeof hours === 'string') return hours

  // If object with raw property
  if (typeof hours === 'object' && hours.raw) {
    try {
      const parsed = JSON.parse(hours.raw)
      if (parsed.text) return parsed.text
    } catch {
      return hours.raw
    }
  }

  return undefined
}

function parseOpeningHours(hours: any) {
  const hoursText = normalizeHours(hours)
  if (!hoursText) return undefined

  const dayMap: Record<string, string> = {
    M: "Monday",
    Mon: "Monday",
    T: "Tuesday",
    Tu: "Tuesday",
    W: "Wednesday",
    Th: "Thursday",
    F: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  }

  const results: any[] = []
  const parts = hoursText.split(',').map(p => p.trim())

  parts.forEach(part => {
    const match = part.match(/([A-Za-z\-]+):\s*(\d{1,2})a-(\d{1,2})p/i)
    if (!match) return

    let days = match[1]
    const openHour = parseInt(match[2])
    const closeHour = parseInt(match[3]) + 12

    const openTime = `${openHour.toString().padStart(2, '0')}:00`
    const closeTime = `${closeHour.toString().padStart(2, '0')}:00`

    if (days.includes('-')) {
      const [start, end] = days.split('-')
      results.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [dayMap[start], dayMap[end]],
        opens: openTime,
        closes: closeTime
      })
    } else {
      results.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayMap[days],
        opens: openTime,
        closes: closeTime
      })
    }
  })

  return results.length ? results : undefined
}
/* ---------- SEO Metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { city, slug } = await params
  const cityName = cleanCity(city)

  const { data: clinics } = await supabase
    .from('clinics')
    .select('*')
    .ilike('city', `%${cityName}%`)

  const clinic = clinics?.find(
    (c) => slugify(c.name) === slug
  )

  const clinicName = clinic?.name || slug.replace(/-/g, ' ')

  return {
    title: `${clinicName} | Dentist in ${cityName}, TX | TexasDentalHub`,
    description: `${clinicName} is a verified dental clinic in ${cityName}, Texas. View address, services, phone number, and contact details.`,
  }
}

/* ---------- Page Component ---------- */

export default async function ClinicPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { city, slug } = await params
  const cityName = cleanCity(city)

  const { data: clinics } = await supabase
    .from('clinics')
    .select('*')
    .ilike('city', `%${cityName}%`)

  const clinic = clinics?.find(
    (c) => slugify(c.name) === slug
  )

  if (!clinic) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Clinic Not Found</h1>
      </div>
    )
  }

  /* ---------- JSON-LD Schema ---------- */

  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinic.name,
    url: `https://texasdentalhub.com/dentists/${city}/clinic/${slug}`,
    telephone: clinic.phone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address,
      addressLocality: cityName,
      addressRegion: "TX",
      postalCode: clinic.zip || undefined,
      addressCountry: "US",
    },
    areaServed: cityName,
    medicalSpecialty: clinic.services || undefined,
    openingHoursSpecification: parseOpeningHours(clinic.hours),
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>{clinic.name}</h1>

      <p>
        <strong>Address:</strong> {clinic.address}
      </p>

      {clinic.phone && (
        <p>
          <strong>Phone:</strong> {clinic.phone}
        </p>
      )}

      {clinic.services?.length > 0 && (
        <p>
          <strong>Services:</strong> {clinic.services.join(', ')}
        </p>
      )}

      {clinic.insurances?.length > 0 && (
        <p>
          <strong>Insurance:</strong> {clinic.insurances.join(', ')}
        </p>
      )}

    {normalizeHours(clinic.hours) && (
  <p>
    <strong>Hours:</strong> {normalizeHours(clinic.hours)}
  </p>
)}

      <p style={{ marginTop: 20 }}>
        <a href={`/dentists/${city}`}>
          ← Back to dentists in {cityName}
        </a>
      </p>

      {/* JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </div>
  )
}