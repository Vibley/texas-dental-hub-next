export const dynamic = "force-dynamic"
import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";
import PageViewTracker from "./components/PageViewTracker";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const metadata = {
  title: "TexasDentalHub",
  description: "Find verified dentists across Texas",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await supabaseAdmin
    .from("clinics")
    .select("city");

  const cities = Array.from(
    new Set(data?.map((c) => c.city).filter(Boolean))
  ).sort();

  return (
    <html lang="en">
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-T4C8X1JRLZ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', 'G-T4C8X1JRLZ');
        `}
      </Script>

      <body>
        <PageViewTracker />

        <Header cities={cities} />

        <div className="container">{children}</div>

        <footer className="site-footer">
          <div className="footer-container">
            <div className="footer-column">
              <h3 className="footer-brand">TexasDental Hub</h3>
              <p>
                A Texas-focused dental directory helping patients
                find trusted local dentists without third-party
                booking networks or misleading listings.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} TexasDentalHub. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}