import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { formatPhone, phoneDigits, whatsappLink } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import { Year } from "./Year";

export function Footer({ settings }: { settings: SiteSettings }) {
  const wa = whatsappLink(settings.whatsapp, "Hello Alagu Vacations, I'd like to plan a trip.");
  return (
    <footer className="bg-navy-950 text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="relative h-14 w-14 overflow-hidden rounded-full bg-white ring-2 ring-gold-500/60">
              <Image src="/images/logo.webp" alt="Alagu Vacations logo" fill sizes="56px" className="object-cover" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-white">{settings.business_name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-gold-300">{settings.tagline}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed">{settings.about_text}</p>
          {settings.since_text && <p className="mt-3 text-sm font-semibold text-gold-300">{settings.since_text}</p>}
        </div>

        <nav aria-label="Footer">
          <p className="font-semibold text-white">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["/#about", "About Us"], ["/#vehicles", "Our Vehicles"], ["/#packages", "Packages"],
              ["/#gallery", "Gallery"], ["/book", "Book Your Trip"], ["/privacy", "Privacy Policy"], ["/terms", "Booking Terms"],
            ].map(([href, label]) => (
              <li key={href}><Link href={href} className="hover:text-gold-300">{label}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-semibold text-white">Contact</p>
          <ul className="mt-4 space-y-3 text-sm">
            {settings.phone && (
              <li>
                <a href={`tel:+${phoneDigits(settings.phone)}`} className="flex items-center gap-2.5 hover:text-gold-300">
                  <Phone className="h-4 w-4 text-gold-500" aria-hidden /> {formatPhone(settings.phone)}
                </a>
              </li>
            )}
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-gold-300">
                  <WhatsAppIcon className="h-4 w-4 text-gold-500" /> WhatsApp us
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 hover:text-gold-300">
                  <Mail className="h-4 w-4 text-gold-500" aria-hidden /> {settings.email}
                </a>
              </li>
            )}
            {(settings.address || settings.city) && (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" aria-hidden />
                <span>{[settings.address, settings.city].filter(Boolean).join(", ")}</span>
              </li>
            )}
            {settings.instagram_url && (
              <li>
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-gold-300">
                  <InstagramIcon className="h-4 w-4 text-gold-500" /> @alagu_vacations
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-white/50 sm:px-6 lg:px-8">
          © <Year /> {settings.business_name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
