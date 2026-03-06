import Stripe from "stripe"
import { headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(req: Request) {
  const body = await req.text()

  // ✅ Next.js 16 requires awaiting headers()
  const headerList = await headers()
  const sig = headerList.get("stripe-signature")

  if (!sig) {
    return new Response("Missing stripe signature", { status: 400 })
  }

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const clinicId = session.metadata?.clinicId

    if (clinicId) {
      await supabase
        .from("clinics")
        .update({
          featured: true,
          stripe_subscription_id: session.subscription,
        })
        .eq("id", clinicId)
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription

    await supabase
      .from("clinics")
      .update({ featured: false })
      .eq("stripe_subscription_id", subscription.id)
  }

  return new Response("ok")
}