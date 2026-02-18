export const metadata = {
  title: "About TexasDentalHub",
  description:
    "Learn about TexasDentalHub — a local dental directory helping patients find verified dentists across Texas and helping clinics connect with new patients.",
}

export default function AboutPage() {
  return (
    <div className="legal-page">

      <h1>About TexasDentalHub</h1>

      <p>
        TexasDentalHub is a Texas-focused dental directory created to make it
        easier for patients to find trusted, verified dentists in their local
        communities — and for dental clinics to connect with new patients
        without relying on national ad-driven platforms.
      </p>

      <p>
        We focus on clarity, accuracy, and city-specific listings so patients
        can quickly discover dental clinics that meet their needs, and clinics
        can receive genuine appointment inquiries from local patients.
      </p>

      <h2>Our Mission</h2>

      <p>
        Our mission is simple: help patients make informed dental care decisions
        and help clinics grow through transparent, location-based visibility —
        not fake reviews, pay-to-win rankings, or misleading ads.
      </p>

      <h2>What Makes TexasDentalHub Different</h2>

      <ul>
        <li>Focused exclusively on Texas communities and cities</li>
        <li>Verified clinic listings with accurate contact information</li>
        <li>No fake reviews or inflated rankings</li>
        <li>Direct patient-to-clinic connections</li>
        <li>Built for both patients and dental professionals</li>
      </ul>

      <h2>For Dental Clinics</h2>

      <p>
        TexasDentalHub helps dental clinics increase their local visibility,
        attract new patient inquiries, and showcase their services to people
        actively searching for dental care in their area.
      </p>

    <div className="about-cta">
  <a href="/contact" className="btn primary about-btn">
    Contact TexasDentalHub
  </a>
</div>

      <div className="back-link">
        <a href="/">← Back to Home</a>
      </div>

    </div>
  )
}