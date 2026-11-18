import type { EnquiryStatus } from "@/lib/types";

const STATUS_STYLE: Record<EnquiryStatus, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  contacted: "bg-sky-100 text-sky-800 ring-sky-200",
  confirmed: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  cancelled: "bg-slate-200 text-slate-700 ring-slate-300",
};

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${STATUS_STYLE[status]}`}>
      {status}
    </span>
  );
}

export function PageTitle({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{title}</h1>
        {text && <p className="mt-1 text-sm text-slate-600">{text}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="animate-pulse space-y-3" aria-label={label}>
      <div className="h-8 w-56 rounded bg-slate-200" />
      <div className="h-24 rounded-xl bg-slate-200/70" />
      <div className="h-24 rounded-xl bg-slate-200/70" />
    </div>
  );
}
