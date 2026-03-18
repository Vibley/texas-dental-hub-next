import ContactForm from "../components/ContactForm"

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const inquiryType = params?.type ?? "General Inquiry"

  return (
    <div style={{ padding: "15px 10px" }}>
      
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          {inquiryType}
        </h1>

        <ContactForm inquiryType={inquiryType} />
      </div>

    </div>
  )
}