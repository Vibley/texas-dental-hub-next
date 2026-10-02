'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      })
    }

    // Immediately after route change
    scrollToTop()

    // After the browser paints the new route
    const frame1 = requestAnimationFrame(() => {
      scrollToTop()

      requestAnimationFrame(() => {
        scrollToTop()
      })
    })

    // Extra protection for App Router pages that finish
    // rendering/layout shortly after navigation.
    const timer100 = window.setTimeout(scrollToTop, 100)
    const timer300 = window.setTimeout(scrollToTop, 300)

    return () => {
      cancelAnimationFrame(frame1)
      window.clearTimeout(timer100)
      window.clearTimeout(timer300)
    }
  }, [pathname])

  return null
}