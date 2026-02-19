import { supabase } from "@/lib/supabase"
import CityClient from "./CityClient"

function cleanCity(city: string) {
  return city.replace("-tx", "").replace(/-/g, " ")
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("clinics")
    .select("city")

  const cities = Array.from(
    new Set(
      data?.map((c) =>
        c.city.toLowerCase().replace(/\s+/g, "-")
      )
    )
  )

  return cities.map((city) => ({ city }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const cityName = cleanCity(city)

  return {
    title: `Best dentists in ${cityName}, TX | TexasDentalHub`,
    description: `Find top-rated family, cosmetic, and emergency dentists in ${cityName}, Texas.`,
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const cityName = cleanCity(city)

  // 🔥 Fix case sensitivity to match DB ("Houston")

const formattedCity = cityName
  .split(" ")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")


  const { data: clinics } = await supabase
    .from("clinics")
    .select("id, name, address, phone, city, services, insurances, weekend_open, zip")
    .eq("city", formattedCity)

  const clinicList = clinics || []

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <CityClient
        city={city}
        cityName={formattedCity}
        clinics={clinicList}
      />
    </>
  )
}