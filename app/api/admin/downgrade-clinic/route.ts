import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  const { clinicId } = await req.json()

  const { error } = await supabaseAdmin
    .from("clinics")
    .update({
      featured: false,
      stripe_subscription_id: null,
    })
    .eq("id", clinicId)

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }))
}