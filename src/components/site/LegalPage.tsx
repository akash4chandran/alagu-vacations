import { TriangleAlert } from "lucide-react";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section className="bg-navy-900 pb-14 pt-32 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-4xl font-semibold">{title}</h1>
          <p className="mt-3 text-sm text-white/60">Last updated: {updated}</p>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p><strong>Draft for business approval.</strong> This page is a placeholder and must be reviewed and approved by Alagu Vacations (and ideally a legal professional) before launch.</p>
        </div>
        <div className="space-y-6 leading-relaxed text-ink [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-navy-900 [&_li]:ml-5 [&_li]:list-disc [&_li]:mt-1.5">
          {children}
        </div>
      </article>
    </>
  );
}
