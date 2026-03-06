'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '')

    trackEvent('page_view', {
      page_path: url,
    })
  }, [pathname, searchParams])

  return null
}