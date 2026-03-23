export const revalidate = 86400
import { supabase } from "@/lib/supabase"
import CityClient from "./CityClient"
import ScrollToTop from '@/app/components/ScrollToTop';

function cleanCity(city: string) {
  return city.replace("-tx", "").replace(/-/g, " ")
}

function formatCity(city: string) {
  return cleanCity(city)
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function normalizeSlug(city: string) {
  return city
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
}

/* -------------------------------- */
/* Generate Static Routes */
/* -------------------------------- */

export async function generateStaticParams() {
  const { data } = await supabase
    .from("city_seo_content")
    .select("city_slug")

  return (
    data?.map((row) => ({
      city: row.city_slug,
    })) || []
  )
}

/* -------------------------------- */
/* Dynamic Metadata */
/* -------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params

  const citySlug = normalizeSlug(city)
  const formattedCity = formatCity(citySlug)

const { data: citySeo } = await supabase
  .from("city_seo_content")
  .select("meta_title, meta_description")
  .eq("city_slug", citySlug)
  .maybeSingle()

  const canonicalUrl = `https://texasdentalhub.com/dentists/${citySlug}`

  return {
    title:
      citySeo?.meta_title ||
      `Dentists in ${formattedCity}, TX | TexasDentalHub`,
    description:
      citySeo?.meta_description ||
      `Find trusted dentists in ${formattedCity}, TX. Compare local dental clinics and services through TexasDentalHub.`,
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

/* -------------------------------- */
/* City Page */
/* -------------------------------- */

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params

  const citySlug = normalizeSlug(city)
  const formattedCity = formatCity(citySlug)

  /* Clinics */

  const { data: clinics } = await supabase
    .from("clinics")
    .select(
      "id, name, address, phone, city, services, insurances, weekend_open, zip, featured,google_rating,google_review_count,google_photo_reference,google_maps_url,google_formatted_address"  )
   .ilike("city", formattedCity)
    .order("featured", { ascending: false })
    .order("name", { ascending: true })

  const clinicList = clinics || []

/* Nearby Cities (distance based) */

const { data: nearbyCities } = await supabase.rpc("get_nearby_cities", {
  current_slug: citySlug,
  limit_count: 8,
})

  /* City SEO Content */

  const { data: citySeo } = await supabase
    .from("city_seo_content")
    .select("*")
    .eq("city_slug", citySlug)
    .maybeSingle()

  /* Structured Data */

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Dentists in ${formattedCity}, TX`,
    itemListElement: clinicList.map((clinic: any, index: number) => ({
      "@type": "LocalBusiness",
      position: index + 1,
      name: clinic.name,
      telephone: clinic.phone || undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: clinic.address,
        addressLocality: formattedCity,
        addressRegion: "TX",
        postalCode: clinic.zip || undefined,
        addressCountry: "US",
      },
    })),
  }

  return (
    <>
 <ScrollToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <CityClient
        city={citySlug}
        cityName={formattedCity}
        clinics={clinicList}
        citySeo={citySeo}
       nearbyCities={nearbyCities || []}
      />
    </>
  )
}