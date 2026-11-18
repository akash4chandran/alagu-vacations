import Link from "next/link";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { phoneDigits, whatsappLink } from "@/lib/site";

/** Floating WhatsApp button (all screens) + sticky call/book bar on mobile. */
export function FloatingActions({ phone, whatsapp }: { phone: string | null; whatsapp: string | null }) {
  const wa = whatsappLink(whatsapp, "Hello Alagu Vacations, I'd like to plan a trip.");
  return (
    <>
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Alagu Vacations on WhatsApp"
          className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1fa855] text-white shadow-lift transition hover:scale-105 md:bottom-6 md:right-6"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      )}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-navy-100 bg-white/95 p-3 backdrop-blur md:hidden">
        {phone ? (
          <a href={`tel:+${phoneDigits(phone)}`} className="flex items-center justify-center gap-2 rounded-full border border-navy-800 py-3 text-sm font-semibold text-navy-800">
            <Phone className="h-4 w-4" aria-hidden /> Call Now
          </a>
        ) : <span />}
        <Link href="/book" className="flex items-center justify-center rounded-full bg-gold-500 py-3 text-sm font-semibold text-navy-950">
          Book Your Trip
        </Link>
      </div>
    </>
  );
}
