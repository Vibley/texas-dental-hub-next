import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const photoName = searchParams.get('photoName')

  if (!photoName) {
    return NextResponse.json({ error: 'Missing photoName' }, { status: 400 })
  }

  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400`

  const response = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY!,
    },
  })

  if (!response.ok) {
    const text = await response.text()
    console.error("GOOGLE ERROR:", text)

    return NextResponse.json({ error: text }, { status: response.status })
  }

  const buffer = await response.arrayBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/jpeg',
    },
  })
}