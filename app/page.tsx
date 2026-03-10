import { supabase } from "@/lib/supabase"
import HomeClient from "./HomeClient"

export const metadata = {
  title: "Find Verified Dentists in Houston | TexasDentalHub",
  description:
    "TexasDentalHub helps patients find trusted local dentists in Houston and nearby areas.",
  alternates: {
    canonical: "https://texasdentalhub.com/",
  },
}

export const revalidate = 86400

export default async function Page() {

  const { data: cities } = await supabase
    .from("city_seo_content")
    .select("city_name, city_slug")
    .order("city_name", { ascending: true })

  return <HomeClient cities={cities || []} />
}