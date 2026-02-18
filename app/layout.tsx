

import "./globals.css";
import { supabase } from "@/lib/supabase";
import Header from "./components/Header";

export const metadata = {
  title: "TexasDentalHub",
  description: "Find verified dentists across Texas",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // 🔥 Fetch unique cities from database
  const { data } = await supabase
    .from("clinics")
    .select("city");

  const cities = Array.from(
    new Set(data?.map((c) => c.city).filter(Boolean))
  ).sort();

  return (
    <html lang="en">
      <body>

        {/* Header with City Dropdown */}
        <Header cities={cities} />

        <div className="container">
          {children}
        </div>

        {/* Footer */}

        <footer className="site-footer">

  <div className="footer-container">

    {/* Brand Section */}
    <div className="footer-column">
      <h3 className="footer-brand">TexasDental Hub</h3>
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
        <li><a href="/dentists/houston-tx">Houston</a></li>
        <li><a href="/dentists/katy-tx">Katy</a></li>
        <li><a href="/dentists/sugar-land-tx">Sugar Land</a></li>
        <li><a href="/dentists/the-woodlands-tx">The Woodlands</a></li>
        <li><a href="/dentists/conroe-tx">Conroe</a></li>
      </ul>
    </div>

    {/* Quick Links */}
    <div className="footer-column">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/dentists/houston-tx">Find Dentists</a></li>
        <li><a href="/contact">Contact us</a></li>
        <li><a href="/about">About TexasDentalHub</a></li>
      </ul>
    </div>

    {/* Legal */}
    <div className="footer-column">
      <h4>Legal</h4>
      <ul>
        <li><a href="/privacy-policy">Privacy Policy</a></li>
        <li><a href="/terms-of-service">Terms of Service</a></li>
         <li><a href="/disclaimer">  Disclaimer</a></li>
      </ul>
    </div>
 
  <div className="footer-column">
  <h4>For Dentists</h4>
  <ul>
    <li>
      <a href="/contact?type=List%20Your%20Dental%20Practice">
        List Your Dental Practice
      </a>
    </li>
    <li>
      <a href="/contact?type=Claim%20Listing">
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