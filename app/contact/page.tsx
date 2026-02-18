import ContactForm from "../components/ContactForm"

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {

  const params = await searchParams
  const inquiryType = params?.type ?? "General Inquiry"

  return (
    <div className="contact-wrapper">
      <div className="contact-section">
        <h1>{inquiryType}</h1>

        <ContactForm inquiryType={inquiryType} />
      </div>
    </div>
  )
}