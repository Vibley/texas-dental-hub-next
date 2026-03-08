import Link from "next/link"

export default function Disclaimer() {
  return (
    <div className="legal-page">

      <h1>Disclaimer</h1>
      <p className="updated">Last updated: February 2026</p>

      <p>
        TexasDentalHub is owned and operated by Hintsa Hagos LLC, a Texas limited liability company.
        TexasDentalHub is an informational dental clinic directory and does not provide
        medical or dental services.
      </p>

      <p>
        While we strive to keep directory information accurate and up to date,
        TexasDentalHub does not guarantee the completeness, accuracy, or reliability
        of any clinic listing.
      </p>

      <p>
        The information provided on TexasDentalHub is for informational purposes
        only and should not be considered medical or dental advice.
        Users should consult a licensed dental professional for diagnosis
        and treatment.
      </p>

      <p>
        TexasDentalHub does not endorse or guarantee any dental clinic,
        dentist, or healthcare provider listed on this website.
      </p>

      <p>
        Any interactions, appointments, or services obtained through this website
        are solely between the user and the dental clinic.
      </p>

      <p>
        TexasDentalHub is not responsible for medical outcomes, service quality,
        pricing, or disputes arising from clinic interactions.
      </p>

      <div className="back-link">
        <Link href="/">← Back to TexasDentalHub</Link>
      </div>

    </div>
  )
}