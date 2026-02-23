import HomeClient from './HomeClient'

export const metadata = {
  title: 'Find Verified Dentists in Houston | TexasDentalHub',
  description: 'TexasDentalHub helps patients find trusted local dentists in Houston and nearby areas.',
  alternates: {
    canonical: 'https://texasdentalhub.com/',
  },
}

export default function Page() {
  return <HomeClient />
}