import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import axios from "axios"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GOOGLE_API = process.env.GOOGLE_PLACES_API_KEY!

async function enrichClinics() {

  while (true) {

    const { data: clinics, error } = await supabase
      .from("clinics")
      .select("id,name,address,city")
      .is("google_place_id", null)
      .order("id", { ascending: true })
      .limit(50)

    if (error) {
      console.log("Error loading clinics:", error.message)
      return
    }

    if (!clinics || clinics.length === 0) {
      console.log("✅ All clinics enriched.")
      break
    }

    console.log(`\n🚀 Processing batch of ${clinics.length} clinics\n`)

    for (const clinic of clinics) {

      try {

        const cleanName = clinic.name.replace(/[(),]/g, "")

        const searchQuery = `${cleanName} ${clinic.city} TX`

        console.log("Searching:", searchQuery)

        const search = await axios.get(
          "https://maps.googleapis.com/maps/api/place/textsearch/json",
          {
            params: {
              query: searchQuery,
              region: "us",
              key: GOOGLE_API
            }
          }
        )

        const results = search.data.results || []

        if (results.length === 0) {
          console.log("No place found:", cleanName)
          continue
        }

        let placeId: string | null = null

        const streetNumber =
          clinic.address?.toLowerCase().split(" ")[0] || ""

        for (const place of results) {

          const googleAddress =
            place.formatted_address?.toLowerCase() || ""

          if (
            googleAddress.includes(clinic.city.toLowerCase()) &&
            googleAddress.includes(streetNumber)
          ) {
            placeId = place.place_id
            break
          }

        }

        if (!placeId) {
          placeId = results[0].place_id
          console.log("Using first Google result for:", cleanName)
        }

        const details = await axios.get(
          "https://maps.googleapis.com/maps/api/place/details/json",
          {
            params: {
              place_id: placeId,
              fields: "rating,user_ratings_total,photos,url,formatted_address",
              key: GOOGLE_API
            }
          }
        )

        const result = details.data.result

        if (!result) {
          console.log("No details returned:", cleanName)
          continue
        }

        const { error: updateError } = await supabase
          .from("clinics")
          .update({
            google_place_id: placeId,
            google_rating: result.rating,
            google_review_count: result.user_ratings_total,
            google_photo_reference: result.photos?.[0]?.photo_reference,
            google_maps_url: result.url,
            google_formatted_address: result.formatted_address
          })
          .eq("id", clinic.id)

        if (updateError) {
          console.log("Update error:", updateError.message)
        } else {
          console.log("Updated:", cleanName)
        }

        // Prevent Google API throttling
        await new Promise(r => setTimeout(r, 400))

      } catch (err: any) {
        console.log("Error processing:", clinic.name, err.message)
      }

    }

    console.log("\n⏳ Waiting before next batch...\n")

    // pause between batches
    await new Promise(r => setTimeout(r, 2000))

  }

}

enrichClinics()