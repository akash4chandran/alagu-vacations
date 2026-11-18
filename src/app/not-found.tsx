import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy-900 bg-ornament px-4 text-center text-white">
      <div className="max-w-lg">
        <span className="relative mx-auto block h-24 w-24 overflow-hidden rounded-full bg-white ring-4 ring-gold-500/50">
          <Image src="/images/logo.webp" alt="Alagu Vacations" fill sizes="96px" className="object-cover" />
        </span>
        <p className="mt-8 font-display text-7xl font-semibold text-gold-500">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Looks like a wrong turn</h1>
        <p className="mt-3 text-white/70">The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on the road.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="rounded-full bg-gold-500 px-7 py-3.5 font-semibold text-navy-950 hover:bg-gold-300">Back to home</Link>
          <Link href="/book" className="rounded-full border border-white/30 px-7 py-3.5 font-semibold hover:bg-white/10">Book a trip</Link>
        </div>
      </div>
    </main>
  );
}
