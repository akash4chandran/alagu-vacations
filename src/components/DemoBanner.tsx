"use client";

import { usePathname } from "next/navigation";
import { Eye, LogOut } from "lucide-react";

/** Small, unobtrusive notice shown on every page of the private demo deployment. */
export function DemoBanner() {
  const pathname = usePathname();
  if (pathname.startsWith("/demo-access")) return null;
  return (
    <div
      className="fixed bottom-24 left-3 z-50 flex items-center gap-2 rounded-full bg-navy-950/90 py-1.5 pl-3 pr-1.5 text-xs text-white shadow-lift ring-1 ring-gold-500/40 backdrop-blur md:bottom-5 md:left-5"
      role="note"
      aria-label="Preview website notice"
    >
      <Eye className="h-3.5 w-3.5 text-gold-300" aria-hidden />
      <span className="font-semibold">Preview Website – Alagu Vacations</span>
      <form action="/api/demo-access/logout" method="post">
        <button
          type="submit"
          className="ml-1 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 font-medium hover:bg-white/20"
          title="Leave the preview on this device"
        >
          <LogOut className="h-3 w-3" aria-hidden /> Exit
        </button>
      </form>
    </div>
  );
}
