export type Clinic = {
  id: string
  name: string
  address: string
  city: string   // 👈 THIS MUST EXIST
  phone?: string
  services?: string[]
  insurances?: string[]
  weekend_open?: string
  zip?: string
}