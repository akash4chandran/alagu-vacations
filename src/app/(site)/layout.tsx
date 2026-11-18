import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <a href="#main" className="sr-only z-[70] rounded bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Navbar phone={settings.phone} />
      <main id="main" className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer settings={settings} />
      <FloatingActions phone={settings.phone} whatsapp={settings.whatsapp} />
    </>
  );
}
