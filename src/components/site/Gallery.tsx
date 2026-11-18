"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

/** Instagram-style grid with an accessible lightbox (Esc / arrow keys / swipe-free buttons). */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  if (items.length === 0) return null;
  const current = index !== null ? items[index] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-square h-full w-full overflow-hidden rounded-2xl bg-navy-100"
              aria-label={`Open photo: ${item.caption ?? "Alagu Vacations"}`}
            >
              <Image
                src={item.image_url}
                alt={item.caption ?? "Alagu Vacations photo"}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              {item.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent p-3 text-left text-sm font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  {item.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
        >
          <div className="relative flex max-h-full w-full max-w-4xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-[75vh] w-full">
              <Image src={current.image_url} alt={current.caption ?? "Alagu Vacations photo"} fill sizes="90vw" className="object-contain" />
            </div>
            {current.caption && <p className="mt-4 text-center text-white/90">{current.caption}</p>}
            <p className="mt-1 text-sm text-white/50">{(index ?? 0) + 1} / {items.length}</p>
          </div>
          <button type="button" onClick={close} className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
          {items.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Previous photo">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Next photo">
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
