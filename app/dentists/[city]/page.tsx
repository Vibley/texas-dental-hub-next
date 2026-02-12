import { supabase } from '@/lib/supabase'

function cleanCity(city: string) {
  return city.replace('-tx', '').replace(/-/g, ' ')
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/* 🔥 SEO Metadata */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const cityName = cleanCity(city)

  return {
    title: `Dentists in ${cityName}, TX | TexasDentalHub`,
    description: `Find verified dentists in ${cityName}, Texas. Browse local clinics and contact them directly.`,
  }
}

/* Page Content */
export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const cityName = cleanCity(city)

  const { data: clinics } = await supabase
    .from('clinics')
    .select('*')
    .ilike('city', `%${cityName}%`)

  return (
    <div style={{ padding: 40 }}>
      <h1>Dentists in {cityName}, TX</h1>

      <ul>
        {clinics?.map((clinic) => (
          <li key={clinic.id}>
            <a href={`/dentists/${city}/clinic/${slugify(clinic.name)}`}>
              {clinic.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}