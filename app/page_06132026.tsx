import { supabase } from "@/lib/supabase"
import HomeClient from "./HomeClient"

export const metadata = {
  title:
    "TexasDentalHub – Find Top Dentists in Houston Metro & Across Texas",

  description:
    "Compare dentists in Houston and Texas cities for family, cosmetic, pediatric, and emergency dental care. Find clinics accepting new patients, weekend appointments, and major insurance plans.",

  alternates: {
    canonical: "https://texasdentalhub.com/",
  },

  openGraph: {
    title:
      "TexasDentalHub – Find Top Dentists in Houston Metro & Across Texas",
    description:
      "Compare dentists in Houston and Texas cities for family, cosmetic, pediatric, and emergency dental care. Find clinics accepting new patients, weekend appointments, and major insurance plans.",
    url: "https://texasdentalhub.com/",
    siteName: "TexasDentalHub",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "TexasDentalHub – Find Top Dentists in Houston Metro & Across Texas",
    description:
      "Compare dentists in Houston and Texas cities for family, cosmetic, pediatric, and emergency dental care. Find clinics accepting new patients, weekend appointments, and major insurance plans.",
  },
}

export const revalidate = 86400

export default async function Page() {
  const { data: cities } = await supabase
    .from("city_seo_content")
    .select("city_name, city_slug, latitude, longitude")
    .order("city_name", { ascending: true })

  return <HomeClient cities={cities || []} />
}