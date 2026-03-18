export const dynamic = "force-dynamic"
import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";
import PageViewTracker from "./components/PageViewTracker";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ScrollToTop from "./components/ScrollToTop"

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
  .from("city_seo_content")
  .select("city_name")
  .order("city_name");

const cities = data?.map((c) => c.city_name) || [];




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
  <ScrollToTop />

        <Header cities={cities} />

        <div className="container">{children}</div>

<footer className="site-footer">

  <div className="footer-container">

    {/* Brand */}
    <div className="footer-column">
      <h3 className="footer-brand">TexasDentalHub</h3>
      <p>
        A Texas-focused dental directory helping patients
        find trusted local dentists without third-party
        booking networks or misleading listings.
      </p>
    </div>

    {/* Popular Cities */}
    <div className="footer-column">
      <h4>Popular Cities</h4>
      <ul>
        <li><a href="/dentists/houston">Houston</a></li>
        <li><a href="/dentists/dallas">Dallas</a></li>
        <li><a href="/dentists/austin">Austin</a></li>
        <li><a href="/dentists/san-antonio">San Antonio</a></li>
        <li><a href="/dentists/fort-worth">Fort Worth</a></li>
       <li><a href="/dentists/el-paso">El Paso</a></li>
       <li><a href="/dentists/arlington">Arlington</a></li>
      <li><a href="/dentists/corpus-christi">Corpus Christi</a></li>
      </ul>
    </div>

    {/* Quick Links */}
    <div className="footer-column">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/dentists/houston">Find Dentists</a></li>
        <a href="/contact">Contact us</a>
        <li><a href="/about">About TexasDentalHub</a></li>
      </ul>
    </div>

    {/* Legal */}
    <div className="footer-column">
      <h4>Legal</h4>
      <ul>
        <li><a href="/privacy-policy">Privacy Policy</a></li>
        <li><a href="/terms-of-service">Terms of Service</a></li>
        <li><a href="/disclaimer">Disclaimer</a></li>
      </ul>
    </div>

    {/* For Dentists */}
    <div className="footer-column">
      <h4>For Dentists</h4>
      <ul>
        <li>
          <a href="/contact?type=List%20Your%20Dental%20Practice">
            List Your Dental Practice
          </a>
        </li>
        <li>
          <a href="/contact?type=Claim%20an%20Existing%20Listing">
            Claim an Existing Listing
          </a>
        </li>
        <li>
          <a href="/contact?type=Get%20More%20Patient%20Leads">
            Get More Patient Leads
          </a>
        </li>
        <li>
          <a href="/contact?type=Advertising%20%26%20Featured%20Listings">
            Advertising & Featured Listings
          </a>
        </li>
      </ul>
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