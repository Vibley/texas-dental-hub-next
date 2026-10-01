export type Clinic = {
  id: string
  name: string
  address: string
  city: string

  phone?: string
  zip?: string

  services?: string[]
  insurances?: string[]

  featured?: boolean

  weekend_open?: string
  accepts_new_patients?: boolean
  emergency_available?: boolean

  google_rating?: number
  google_review_count?: number
  google_place_id?: string
  google_photo_reference?: string
  google_maps_url?: string
  google_formatted_address?: string

  website?: string
}