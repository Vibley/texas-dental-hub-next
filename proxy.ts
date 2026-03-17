import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const url = request.nextUrl

  if (url.pathname.includes('/clinic/')) {
    const newPath = url.pathname.replace('/clinic', '')
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dentists/:path*'],
}