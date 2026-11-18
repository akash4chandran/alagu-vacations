"use client";

import { useClientValue } from "@/lib/use-client-value";

const currentYear = () => String(new Date().getFullYear());

/** Current year, read in the browser so prerendered HTML never bakes in a stale year. */
export function Year() {
  return <>{useClientValue(currentYear, "2026")}</>;
}
