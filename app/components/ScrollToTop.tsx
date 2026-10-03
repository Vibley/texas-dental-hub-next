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
      window.scrollTo(0, 0)

      // Extra fallback for mobile browsers
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    // Immediately after route change
    scrollToTop()

    // After browser paints
    const frame1 = requestAnimationFrame(() => {
      scrollToTop()

      requestAnimationFrame(() => {
        scrollToTop()
      })
    })

    // Mobile Chrome can restore scroll position later
    const timer100 = window.setTimeout(scrollToTop, 100)
    const timer300 = window.setTimeout(scrollToTop, 300)
    const timer600 = window.setTimeout(scrollToTop, 600)

    return () => {
      cancelAnimationFrame(frame1)
      window.clearTimeout(timer100)
      window.clearTimeout(timer300)
      window.clearTimeout(timer600)
    }
  }, [pathname])

  return null
}