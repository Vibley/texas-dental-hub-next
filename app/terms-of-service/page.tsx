import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="legal-page">

      <h1>Terms of Service</h1>
      <p className="updated">Last updated: March 2026</p>

      <p>
        By accessing or using TexasDentalHub, you agree to the following Terms
        of Service. If you do not agree with these terms, please do not use the website.
      </p>

      <p>
        TexasDentalHub is owned and operated by Hintsa Hagos LLC, a Texas
        limited liability company.
      </p>

      <h2>1. Service Description</h2>
      <p>
        TexasDentalHub is an informational online directory designed to help
        users discover dental clinics in Texas. The website provides publicly
        available information about dental clinics for convenience and
        informational purposes only.
      </p>

      <p>
        TexasDentalHub does not provide medical or dental services.
      </p>

      <h2>2. No Medical Advice</h2>
      <p>
        Information provided on TexasDentalHub is for general informational
        purposes only and should not be considered medical or dental advice.
        Users should consult licensed dental professionals for diagnosis,
        treatment, and healthcare decisions.
      </p>

      <h2>3. Clinic Listings</h2>
      <p>
        Dental clinic listings may be collected from publicly available
        information, clinic submissions, or third-party sources. While we
        strive to maintain accurate information, TexasDentalHub does not
        guarantee the completeness, accuracy, or availability of any clinic
        listing.
      </p>

      <p>
        Dental clinics may request updates or removal of their listings by
        contacting us.
      </p>

      <h2>4. User Responsibilities</h2>
      <p>
        By using this website, you agree not to misuse the platform, submit
        false information, attempt unauthorized access, or engage in unlawful
        activities while using TexasDentalHub.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        TexasDentalHub and Hintsa Hagos LLC are not responsible for medical
        outcomes, service quality, pricing, or disputes arising from
        interactions between users and dental clinics listed on the website.
      </p>

      <p>
        To the fullest extent permitted by law, TexasDentalHub shall not be
        liable for any damages resulting from the use of this website.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        All website content, design, branding, and platform features are the
        property of Hintsa Hagos LLC unless otherwise stated. Unauthorized
        copying, reproduction, or distribution of website content is prohibited.
      </p>

      <h2>7. Changes to These Terms</h2>
      <p>
        We may update these Terms of Service from time to time. Updates will be
        posted on this page with a revised "Last updated" date.
        Continued use of the website after updates constitutes acceptance
        of the revised terms.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        These terms are governed by the laws of the State of Texas,
        United States.
      </p>

      <div className="back-link">
        <Link href="/">← Back to TexasDentalHub</Link>
      </div>

    </div>
  )
}