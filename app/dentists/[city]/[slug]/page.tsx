import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import CardCTA from "@/app/components/CardCTA"
import ScrollToTop from "@/app/components/ScrollToTop"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function cleanCity(city: string) {
  return city
    .replace("-tx", "")
    .replace(/-/g, " ")
    .trim()
}

function formatCity(city: string) {
  return cleanCity(city)
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ")
}

/* -------------------------------- */
/* Dynamic Metadata */
/* -------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    city: string
    slug: string
  }>
}) {
  const { city, slug } = await params

  const cityName = cleanCity(city)
  const formattedCity = formatCity(city)

  const { data: clinics } = await supabase
    .from("clinics")
    .select(
      `
        name,
        city,
        services,
        insurances,
        google_rating,
        google_review_count,
        accepts_new_patients,
        emergency_available,
        weekend_open
      `
    )
    .ilike("city", cityName)

  const clinic = clinics?.find(
    (clinic) => slugify(clinic.name) === slug
  )

  const canonicalUrl =
    `https://texasdentalhub.com/dentists/${city}/${slug}`

  /*
   * Missing clinic:
   * Keep metadata minimal.
   * The actual page render below will call notFound().
   */
  if (!clinic) {
    return {
      title: `Dental Practice Not Found | TexasDentalHub`,
      description:
        `This dental practice listing could not be found on TexasDentalHub.`,
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const serviceText =
    Array.isArray(clinic.services) &&
    clinic.services.length > 0
      ? clinic.services.slice(0, 3).join(", ")
      : null

  let description =
    `View ${clinic.name} in ${formattedCity}, TX. See contact information`

  if (clinic.google_rating) {
    description +=
      `, Google rating ${clinic.google_rating.toFixed(1)}`
  }

  if (clinic.google_review_count) {
    description +=
      ` based on ${clinic.google_review_count} reviews`
  }

  if (serviceText) {
    description += `, and services including ${serviceText}`
  } else {
    description += `, dental services, insurance information, and practice details`
  }

  description += "."

  return {
    title:
      `${clinic.name} in ${formattedCity}, TX | TexasDentalHub`,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title:
        `${clinic.name} in ${formattedCity}, TX | TexasDentalHub`,

      description,

      url: canonicalUrl,

      type: "website",
    },

    twitter: {
      card: "summary",
      title:
        `${clinic.name} in ${formattedCity}, TX | TexasDentalHub`,

      description,
    },
  }
}

/* -------------------------------- */
/* Clinic Detail Page */
/* -------------------------------- */

export default async function ClinicDetail({
  params,
}: {
  params: Promise<{
    city: string
    slug: string
  }>
}) {
  const { slug, city } = await params

  const cityName = cleanCity(city)
  const formattedCity = formatCity(city)

  const { data: clinics } = await supabase
    .from("clinics")
    .select("*")
    .ilike("city", cityName)

  if (!clinics) {
    notFound()
  }

  const clinic = clinics.find(
    (clinic) => slugify(clinic.name) === slug
  )

  if (!clinic) {
    notFound()
  }

  const services =
    Array.isArray(clinic.services)
      ? clinic.services
      : []

  const insurances =
    Array.isArray(clinic.insurances)
      ? clinic.insurances
      : []

  const hours = (() => {
    if (!clinic.hours) return ""

    if (typeof clinic.hours === "string") {
      return clinic.hours
    }

    if (clinic.hours.raw) {
      try {
        const parsed =
          JSON.parse(clinic.hours.raw)

        return parsed.text || clinic.hours.raw
      } catch {
        return clinic.hours.raw
      }
    }

    return ""
  })()

  const canonicalUrl =
    `https://texasdentalhub.com/dentists/${city}/${slug}`

  /* -------------------------------- */
  /* Clinic Structured Data */
  /* -------------------------------- */

  const structuredData = {
    "@context": "https://schema.org",

    "@type": "Dentist",

    name: clinic.name,

    url: canonicalUrl,

    telephone:
      clinic.phone || undefined,

    address: {
      "@type": "PostalAddress",

      streetAddress:
        clinic.google_formatted_address
          ? clinic.google_formatted_address.replace(
              ", USA",
              ""
            )
          : clinic.address,

      addressLocality:
        formattedCity,

      addressRegion: "TX",

      postalCode:
        clinic.zip || undefined,

      addressCountry: "US",
    },

    ...(clinic.google_rating &&
    clinic.google_review_count
      ? {
          aggregateRating: {
            "@type": "AggregateRating",

            ratingValue:
              clinic.google_rating,

            reviewCount:
              clinic.google_review_count,
          },
        }
      : {}),
  }

  return (
    <>
      <ScrollToTop />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(structuredData),
        }}
      />

      <main className="clinic-detail">

        {/* BACK LINK */}

        <div className="back-link">
          <a
            href={`/dentists/${city}`}
            className="back-btn"
          >
            ← Back to dentists in {formattedCity}
          </a>
        </div>

        {/* CLINIC HERO */}

        <div className="clinic-hero">

          <div className="clinic-hero-content">

            <h1 className="clinic-title">
              {clinic.name}
            </h1>

            <div className="clinic-subtitle">
              {formattedCity}, TX
            </div>

            {clinic.google_rating != null && (
              <div className="hero-rating">

                ⭐{" "}
                {Number(
                  clinic.google_rating
                ).toFixed(1)}

                {clinic.google_review_count != null &&
                  ` (${clinic.google_review_count.toLocaleString()} Google reviews)`}

              </div>
            )}

          </div>

        </div>

        {/* CALL / APPOINTMENT CTA */}

        <div className="space-y-4">

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "10px",
            }}
            className="card-actions responsive-cta"
          >

            <CardCTA
              phone={clinic.phone}
              city={city}
              clinicName={clinic.name}
            />

          </div>

          {/* PRACTICE INFORMATION */}

          <section className="clinic-card">

            <div className="info-row">

              <div className="info-label">
                Address
              </div>

              <div className="info-value">

                <a
                  href={
                    clinic.google_maps_url ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      clinic.google_formatted_address ||
                        clinic.address
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >

                  {clinic.google_formatted_address
                    ? clinic.google_formatted_address.replace(
                        ", USA",
                        ""
                      )
                    : clinic.address}

                </a>

              </div>

            </div>

            {services.length > 0 && (
              <div className="info-row">

                <div className="info-label">
                  Services
                </div>

                <div className="info-value">
                  {services.join(", ")}
                </div>

              </div>
            )}

            {insurances.length > 0 && (
              <div className="info-row">

                <div className="info-label">
                  Insurance
                </div>

                <div className="info-value">

                  <div className="insurance-pills">

                    {insurances.map(
                      (
                        insurance: string,
                        index: number
                      ) => (
                        <span
                          key={index}
                          className="pill"
                        >
                          {insurance}
                        </span>
                      )
                    )}

                  </div>

                </div>

              </div>
            )}

            {hours && (
              <div className="info-row">

                <div className="info-label">
                  Hours
                </div>

                <div className="info-value">
                  {hours}
                </div>

              </div>
            )}

            {clinic.accepts_new_patients != null && (
              <div className="info-row">

                <div className="info-label">
                  New Patients
                </div>

                <div className="info-value">

                  {clinic.accepts_new_patients
                    ? "Accepting new patients"
                    : "Not currently marked as accepting new patients"}

                </div>

              </div>
            )}

            {clinic.emergency_available === true && (
              <div className="info-row">

                <div className="info-label">
                  Emergency Care
                </div>

                <div className="info-value">
                  Emergency dental availability listed
                </div>

              </div>
            )}

            {clinic.weekend_open &&
              String(
                clinic.weekend_open
              ).toLowerCase() === "yes" && (
                <div className="info-row">

                  <div className="info-label">
                    Weekend Availability
                  </div>

                  <div className="info-value">
                    Weekend hours available
                  </div>

                </div>
              )}

          </section>

        </div>

        {/* INTERNAL LINK */}

        <div
          style={{
            marginTop: "24px",
          }}
        >
          <a
            href={`/dentists/${city}`}
            className="back-btn"
          >
            View all dentists in {formattedCity} →
          </a>
        </div>

        {/* CLAIM LISTING */}

        <div className="claim-listing-box premium">

          <div className="claim-listing-title">
            Own this dental practice?
          </div>

          <div className="claim-listing-text">
            Get more patients, manage your
            listing, and receive appointment
            requests.
          </div>

          <a
            href={`/contact?type=Claim%20Listing&clinic=${encodeURIComponent(
              clinic.name
            )}`}
            className="claim-listing-btn"
          >
            Claim This Listing
          </a>

        </div>

      </main>
    </>
  )
}