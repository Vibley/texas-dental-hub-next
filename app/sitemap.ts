import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function cityToSlug(city: string) {
  return `${slugify(city)}-tx`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://texasdentalhub.com'

  // Fetch all clinics
  const { data: clinics } = await supabase
    .from('clinics')
    .select('name, city')

  if (!clinics) return []

  const urls: MetadataRoute.Sitemap = []

  // Homepage
  urls.push({
    url: baseUrl,
    changeFrequency: 'weekly',
    priority: 1,
  })

  // Collect unique cities
  const uniqueCities = Array.from(
    new Set(clinics.map(c => c.city).filter(Boolean))
  )

  // City pages
  uniqueCities.forEach(city => {
    urls.push({
      url: `${baseUrl}/dentists/${cityToSlug(city)}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })

  // Clinic pages
  clinics.forEach(clinic => {
    if (!clinic.city || !clinic.name) return

    urls.push({
      url: `${baseUrl}/dentists/${cityToSlug(clinic.city)}/clinic/${slugify(clinic.name)}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  return urls
}