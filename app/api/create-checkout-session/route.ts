import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
 console.log("SITE URL:", process.env.NEXT_PUBLIC_SITE_URL)
  const { clinicId, clinicName } = await req.json()

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
 success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/clinics?success=true`,
cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/clinics?canceled=true`,
    metadata: {
      clinicId,
      clinicName,
    },
  })

  return NextResponse.json({ url: session.url })

}
