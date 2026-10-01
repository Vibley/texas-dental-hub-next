import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      clinic_name,
      city,
      source_page,
      source_position,
      visitor_id,
      session_id,
    } = body

    if (!clinic_name || !city || !source_position) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    /*
     * Convert source_position into a controlled event type.
     */
    let eventType: string

    switch (source_position) {
      case 'card_call_button':
        eventType = 'call_click'
        break

      case 'appointment_modal_open':
        eventType = 'appointment_modal_open'
        break

      case 'appointment_submit':
        eventType = 'appointment_submit'
        break

      default:
        console.warn(
          'Unknown tracking source_position:',
          source_position
        )

        return NextResponse.json(
          { error: 'Invalid source_position' },
          { status: 400 }
        )
    }

    /*
     * Keep the legacy call_clicks table for now.
     *
     * ONLY real Call Now clicks are inserted here.
     */
    if (eventType === 'call_click') {
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
        console.error(
          'call_clicks insert error:',
          callError
        )
      }
    }

    /*
     * clinic_events is our primary analytics table.
     */
    const { error: eventError } = await supabase
      .from('clinic_events')
      .insert([
        {
          clinic_name,
          city,
          event_type: eventType,
          source_page,
          visitor_id: visitor_id || null,
          session_id: session_id || null,
          created_at: new Date().toISOString(),
        },
      ])

    if (eventError) {
      console.error(
        'clinic_events insert error:',
        eventError
      )

      return NextResponse.json(
        { error: 'Unable to record event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      event_type: eventType,
    })
  } catch (err) {
    console.error(
      'Tracking API error:',
      err
    )

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}