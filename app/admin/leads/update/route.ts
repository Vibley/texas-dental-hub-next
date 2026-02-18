import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const formData = await request.formData()
  const status = formData.get('status')

  const supabase = await createClient()
  await supabase.from('leads').update({ status }).eq('id', id)

  return NextResponse.redirect(new URL('/admin/leads', request.url))
}
