import { supabase } from "@/lib/supabase"
import CityClient from "./CityClient"

function cleanCity(city: string) {
  return city.replace("-tx", "").replace(/-/g, " ")
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const cityName = cleanCity(city)

  return {
    title: `Dentists in ${cityName}, TX | TexasDentalHub`,
    description: `Browse verified dentists in ${cityName}, Texas.`,
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const cityName = cleanCity(city)

  const { data: clinics } = await supabase
    .from("clinics")
    .select("id, name, address, phone, city,services, insurances, weekend_open, zip")
    .ilike("city", `%${cityName}%`)

  return (
    <CityClient
      city={city}
      cityName={cityName}
      clinics={clinics || []}
    />
  )
}