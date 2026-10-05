import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import CardCTA from "@/app/components/CardCTA"

/* -------------------------------- */
/* Helpers */
/* -------------------------------- */

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

function cleanWebsiteUrl(website?: string | null) {
  if (!website) return null

  const trimmed = website.trim()

  if (!trimmed) return null

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed
  }

  return `https://${trimmed}`
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

  if (!clinic) {
    return {
      title: "Dental Practice Not Found | TexasDentalHub",
      description:
        "This dental practice listing could not be found on TexasDentalHub.",
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
      `, Google rating ${Number(clinic.google_rating).toFixed(1)}`
  }

  if (clinic.google_review_count) {
    description +=
      ` based on ${clinic.google_review_count} reviews`
  }

  if (serviceText) {
    description +=
      `, and services including ${serviceText}`
  } else {
    description +=
      ", dental services, insurance information, and practice details"
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

  const services: string[] =
    Array.isArray(clinic.services)
      ? clinic.services
      : []

  const insurances: string[] =
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
        const parsed = JSON.parse(
          clinic.hours.raw
        )

        return parsed.text || clinic.hours.raw
      } catch {
        return clinic.hours.raw
      }
    }

    return ""
  })()

  const address =
    clinic.google_formatted_address
      ? clinic.google_formatted_address.replace(
          ", USA",
          ""
        )
      : clinic.address

  const mapsUrl =
    clinic.google_maps_url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      clinic.google_formatted_address ||
        clinic.address
    )}`

  const websiteUrl =
    cleanWebsiteUrl(clinic.website)

  const weekendOpen =
    clinic.weekend_open &&
    String(
      clinic.weekend_open
    ).toLowerCase() === "yes"

  const hasAvailabilityBadges =
    clinic.accepts_new_patients === true ||
    clinic.emergency_available === true ||
    weekendOpen

  const canonicalUrl =
    `https://texasdentalhub.com/dentists/${city}/${slug}`

  /* -------------------------------- */
  /* Structured Data */
  /* -------------------------------- */

  const structuredData = {
    "@context": "https://schema.org",

    "@type": "Dentist",

    name: clinic.name,

    url: canonicalUrl,

    telephone:
      clinic.phone || undefined,

    ...(websiteUrl
      ? {
          sameAs: [websiteUrl],
        }
      : {}),

    address: {
      "@type": "PostalAddress",

      streetAddress: address,

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(structuredData),
        }}
      />

      <main className="tdh-clinic-detail">

        {/* -------------------------------- */}
        {/* Back navigation */}
        {/* -------------------------------- */}

        <div className="tdh-clinic-back">
          <a href={`/dentists/${city}`}>
            ← Back to dentists in{" "}
            {formattedCity}
          </a>
        </div>

        {/* -------------------------------- */}
        {/* Hero */}
        {/* -------------------------------- */}

        <section className="tdh-clinic-hero">

          <div className="tdh-clinic-hero-main">

            <div className="tdh-clinic-location-label">
              Dental Practice in{" "}
              {formattedCity}, TX
            </div>

            <h1 className="tdh-clinic-title">
              {clinic.name}
            </h1>

            {clinic.google_rating != null && (
              <div className="tdh-clinic-rating">

                <span
                  className="tdh-clinic-star"
                  aria-hidden="true"
                >
                  ★
                </span>

                <strong>
                  {Number(
                    clinic.google_rating
                  ).toFixed(1)}
                </strong>

                {clinic.google_review_count != null && (
                  <span className="tdh-clinic-review-count">
                    {clinic.google_review_count.toLocaleString()}{" "}
                    Google reviews
                  </span>
                )}

              </div>
            )}

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tdh-clinic-hero-address"
            >
              {address}
            </a>

            {hasAvailabilityBadges && (
              <div className="tdh-clinic-badges">

                {clinic.accepts_new_patients ===
                  true && (
                  <span className="tdh-clinic-badge">
                    ✓ Accepting new patients
                  </span>
                )}

                {clinic.emergency_available ===
                  true && (
                  <span className="tdh-clinic-badge">
                    ✓ Emergency appointments
                  </span>
                )}

                {weekendOpen && (
                  <span className="tdh-clinic-badge">
                    ✓ Open weekends
                  </span>
                )}

              </div>
            )}

          </div>

          {/* CTA panel */}

          <aside className="tdh-clinic-cta-panel">

            <div className="tdh-clinic-cta-heading">
              Contact this practice
            </div>

            <p className="tdh-clinic-cta-copy">
              Call the dental office or send
              an appointment request.
            </p>

            <div className="tdh-clinic-card-cta">
              <CardCTA
                phone={clinic.phone}
                city={city}
                clinicName={clinic.name}
              />
            </div>

            <p className="tdh-clinic-request-note">
              Appointment requests are not
              confirmed bookings. The dental
              office will confirm availability
              directly with you.
            </p>

          </aside>

        </section>

        {/* -------------------------------- */}
        {/* Main content */}
        {/* -------------------------------- */}

        <div className="tdh-clinic-layout">

          <div className="tdh-clinic-main-column">

            {/* PRACTICE INFORMATION */}

            <section className="tdh-clinic-section">

              <div className="tdh-clinic-section-header">
                <h2>Practice Information</h2>

                <p>
                  Contact and location
                  information for{" "}
                  {clinic.name}.
                </p>
              </div>

              <div className="tdh-clinic-info-list">

                <div className="tdh-clinic-info-row">

                  <div className="tdh-clinic-info-label">
                    Address
                  </div>

                  <div className="tdh-clinic-info-value">

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {address}
                    </a>

                  </div>

                </div>

                {clinic.phone && (
                  <div className="tdh-clinic-info-row">

                    <div className="tdh-clinic-info-label">
                      Phone
                    </div>

                    <div className="tdh-clinic-info-value">
                      <a
                        href={`tel:${clinic.phone}`}
                      >
                        {clinic.phone}
                      </a>
                    </div>

                  </div>
                )}

                {websiteUrl && (
                  <div className="tdh-clinic-info-row">

                    <div className="tdh-clinic-info-label">
                      Website
                    </div>

                    <div className="tdh-clinic-info-value">

                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit practice website ↗
                      </a>

                    </div>

                  </div>
                )}

                {hours && (
                  <div className="tdh-clinic-info-row">

                    <div className="tdh-clinic-info-label">
                      Hours
                    </div>

                    <div className="tdh-clinic-info-value tdh-clinic-hours">
                      {hours}
                    </div>

                  </div>
                )}

              </div>

            </section>

            {/* SERVICES */}

            {services.length > 0 && (
              <section className="tdh-clinic-section">

                <div className="tdh-clinic-section-header">

                  <h2>Dental Services</h2>

                  <p>
                    Services listed for this
                    dental practice.
                  </p>

                </div>

                <div className="tdh-clinic-chip-list">

                  {services.map(
                    (
                      service: string,
                      index: number
                    ) => (
                      <span
                        className="tdh-clinic-chip"
                        key={`${service}-${index}`}
                      >
                        {service}
                      </span>
                    )
                  )}

                </div>

                <p className="tdh-clinic-disclaimer">
                  Contact the dental office to
                  confirm that the specific
                  treatment you need is currently
                  offered.
                </p>

              </section>
            )}

            {/* INSURANCE */}

            {insurances.length > 0 && (
              <section className="tdh-clinic-section">

                <div className="tdh-clinic-section-header">

                  <h2>Insurance Information</h2>

                  <p>
                    Insurance plans listed for{" "}
                    {clinic.name}.
                  </p>

                </div>

                <div className="tdh-clinic-chip-list">

                  {insurances.map(
                    (
                      insurance: string,
                      index: number
                    ) => (
                      <span
                        className="tdh-clinic-chip tdh-clinic-insurance-chip"
                        key={`${insurance}-${index}`}
                      >
                        {insurance}
                      </span>
                    )
                  )}

                </div>

                <p className="tdh-clinic-disclaimer">
                  Insurance participation,
                  networks, and coverage can
                  change. Verify your specific
                  plan and benefits with the
                  dental office or your insurance
                  company before receiving
                  treatment.
                </p>

              </section>
            )}

            {/* LOCATION */}

            <section className="tdh-clinic-section">

              <div className="tdh-clinic-section-header">
                <h2>Location</h2>
              </div>

              <div className="tdh-clinic-location-card">

                <div>

                  <div className="tdh-clinic-location-name">
                    {clinic.name}
                  </div>

                  <div className="tdh-clinic-location-address">
                    {address}
                  </div>

                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tdh-clinic-map-button"
                >
                  Get Directions ↗
                </a>

              </div>

            </section>

            {/* ABOUT */}

            <section className="tdh-clinic-section">

              <div className="tdh-clinic-section-header">
                <h2>
                  About {clinic.name}
                </h2>
              </div>

              <div className="tdh-clinic-about-text">

                <p>
                  {clinic.name} is a dental
                  practice located in{" "}
                  {formattedCity}, Texas.
                  TexasDentalHub provides
                  practice information to help
                  patients compare local dental
                  offices and contact practices
                  directly.
                </p>

                <p>
                  Practice information,
                  availability, services,
                  insurance participation, and
                  office hours can change.
                  Contact the dental office
                  directly to confirm details
                  before scheduling treatment.
                </p>

              </div>

            </section>

            {/* FAQ */}

            <section className="tdh-clinic-section">

              <div className="tdh-clinic-section-header">
                <h2>
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="tdh-clinic-faq">

                <details>
                  <summary>
                    How do I request an
                    appointment with{" "}
                    {clinic.name}?
                  </summary>

                  <p>
                    You can use the Request
                    Appointment option on this
                    page to send an appointment
                    request. The request is not a
                    confirmed booking. The
                    dental office should contact
                    you to confirm availability,
                    date, time, and other
                    appointment details.
                  </p>
                </details>

                {clinic.accepts_new_patients ===
                  true && (
                  <details>

                    <summary>
                      Is {clinic.name} accepting
                      new patients?
                    </summary>

                    <p>
                      This practice is listed on
                      TexasDentalHub as accepting
                      new patients. Availability
                      can change, so confirm
                      current availability
                      directly with the dental
                      office.
                    </p>

                  </details>
                )}

                {clinic.emergency_available ===
                  true && (
                  <details>

                    <summary>
                      Does {clinic.name} offer
                      emergency dental
                      appointments?
                    </summary>

                    <p>
                      This practice is listed as
                      offering emergency dental
                      availability. This does not
                      guarantee immediate or
                      same-day treatment. Contact
                      the office to confirm that
                      it can see you and treat
                      your specific dental need.
                    </p>

                  </details>
                )}

                {insurances.length > 0 && (
                  <details>

                    <summary>
                      Does {clinic.name} accept
                      my dental insurance?
                    </summary>

                    <p>
                      TexasDentalHub displays
                      insurance information
                      available for this
                      practice. Insurance
                      participation and coverage
                      can change, so verify your
                      specific plan with the
                      dental office or your
                      insurance company before
                      treatment.
                    </p>

                  </details>
                )}

              </div>

            </section>

          </div>

          {/* -------------------------------- */}
          {/* Sidebar */}
          {/* -------------------------------- */}

          <aside className="tdh-clinic-sidebar">

            <div className="tdh-clinic-sidebar-card">

              <h2>
                Practice at a glance
              </h2>

              <div className="tdh-clinic-glance-list">

                {clinic.google_rating != null && (
                  <div className="tdh-clinic-glance-row">

                    <span>Google rating</span>

                    <strong>
                      ★{" "}
                      {Number(
                        clinic.google_rating
                      ).toFixed(1)}
                    </strong>

                  </div>
                )}

                {clinic.google_review_count !=
                  null && (
                  <div className="tdh-clinic-glance-row">

                    <span>Google reviews</span>

                    <strong>
                      {clinic.google_review_count.toLocaleString()}
                    </strong>

                  </div>
                )}

                {clinic.accepts_new_patients ===
                  true && (
                  <div className="tdh-clinic-glance-positive">
                    ✓ Accepting new patients
                  </div>
                )}

                {clinic.emergency_available ===
                  true && (
                  <div className="tdh-clinic-glance-positive">
                    ✓ Emergency appointments
                  </div>
                )}

                {weekendOpen && (
                  <div className="tdh-clinic-glance-positive">
                    ✓ Weekend hours
                  </div>
                )}

              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tdh-clinic-sidebar-link"
              >
                View on Google Maps ↗
              </a>

              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tdh-clinic-sidebar-link"
                >
                  Visit practice website ↗
                </a>
              )}

            </div>

            {/* CLAIM LISTING */}

            <div className="tdh-clinic-claim-card">

              <div className="tdh-clinic-claim-eyebrow">
                FOR DENTAL PRACTICES
              </div>

              <h2>
                Own this dental practice?
              </h2>

              <p>
                Claim your listing to manage
                practice information and receive
                appointment requests.
              </p>

              <a
                href={`/contact?type=Claim%20Listing&clinic=${encodeURIComponent(
                  clinic.name
                )}`}
                className="tdh-clinic-claim-button"
              >
                Claim This Listing
              </a>

            </div>

          </aside>

        </div>

        {/* -------------------------------- */}
        {/* Bottom navigation */}
        {/* -------------------------------- */}

        <div className="tdh-clinic-bottom-nav">

          <a href={`/dentists/${city}`}>
            ← View all dentists in{" "}
            {formattedCity}
          </a>

        </div>

      </main>
    </>
  )
}