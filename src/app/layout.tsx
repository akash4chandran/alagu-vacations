import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Manrope, Playfair_Display } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { isDemoMode } from "@/lib/demo";
import { DemoBanner } from "@/components/DemoBanner";
import "./globals.css";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

const description =
  "Alagu Vacations, Dindigul: budget trips and package trips for families and friends in our brand-new 16-seater A/C Force Urbania. Send a booking enquiry online or on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alagu Vacations | Tours & Holiday Packages, Dindigul",
    template: "%s | Alagu Vacations",
  },
  description,
  keywords: ["Alagu Vacations", "Dindigul travels", "Force Urbania rental", "16 seater van Dindigul", "tour packages Tamil Nadu", "family trip van"],
  openGraph: {
    type: "website",
    siteName: "Alagu Vacations",
    title: "Alagu Vacations | Tours & Holiday Packages",
    description,
    locale: "en_IN",
    images: [{ url: "/images/poster-budget-package-trips.webp", width: 597, height: 343, alt: "Alagu Vacations: budget trips and package trips" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/images/logo-crown.webp", apple: "/images/logo.webp" },
  // Private demo deployments must never be indexed.
  ...(isDemoMode() ? { robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#0a1c40",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${manrope.variable} h-full`}>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {children}
        {isDemoMode() && (
          <Suspense fallback={null}>
            <DemoBanner />
          </Suspense>
        )}
      </body>
    </html>
  );
}
