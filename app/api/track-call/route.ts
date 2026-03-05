import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { clinic_name, city, source_page, source_position } = body

    if (!clinic_name || !city || !source_position) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }


console.log("TRACK CALL ROUTE HIT");

    /* ----------------------------------------
       1️⃣ Always log legacy call_clicks table
    ----------------------------------------- */
    const { error: callError } = await supabase
      .from('call_clicks')
      .insert([
        {
          clinic_name,
          city,
          source_page,
          source_position,
        },
      ])

    if (callError) {
      return NextResponse.json({ error: callError }, { status: 400 })
    }

    /* ----------------------------------------
       2️⃣ Determine event type for clinic_events
    ----------------------------------------- */
    let eventType = 'call_click'

    if (source_position === 'appointment_modal_open') {
      eventType = 'appointment_modal_open'
    }

    if (source_position === 'appointment_submit') {
      eventType = 'appointment_submit'
    }

    /* ----------------------------------------
       3️⃣ Insert into clinic_events
    ----------------------------------------- */
    const { error: eventError } = await supabase
      .from('clinic_events')
      .insert([
        {
          clinic_name,
          city,
          event_type: eventType,
          source_page,
        },
      ])

    if (eventError) {
      console.error('clinic_events insert error:', eventError)
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}