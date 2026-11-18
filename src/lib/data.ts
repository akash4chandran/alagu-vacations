import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/env";
import { FALLBACK_GALLERY, FALLBACK_PACKAGES, FALLBACK_SETTINGS, FALLBACK_VEHICLES } from "./fallback";
import type { GalleryItem, SiteSettings, TravelPackage, Vehicle } from "./types";

/** Tag invalidated by every admin content change (see app/admin/actions.ts). */
export const CONTENT_TAG = "site-content";

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  if (!isSupabaseConfigured) return FALLBACK_SETTINGS;
  const { data, error } = await createPublicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) {
    if (error) console.error("[data] settings:", error.message);
    return FALLBACK_SETTINGS;
  }
  return { ...FALLBACK_SETTINGS, ...data } as SiteSettings;
}

export async function getVehicles(): Promise<Vehicle[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  if (!isSupabaseConfigured) return FALLBACK_VEHICLES;
  const { data, error } = await createPublicClient()
    .from("vehicles")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("created_at");
  if (error) {
    console.error("[data] vehicles:", error.message);
    return FALLBACK_VEHICLES;
  }
  return data as Vehicle[];
}

export async function getPackages(): Promise<TravelPackage[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  if (!isSupabaseConfigured) return FALLBACK_PACKAGES;
  const { data, error } = await createPublicClient()
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("created_at");
  if (error) {
    console.error("[data] packages:", error.message);
    return FALLBACK_PACKAGES;
  }
  return data as TravelPackage[];
}

export async function getGallery(): Promise<GalleryItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  if (!isSupabaseConfigured) return FALLBACK_GALLERY;
  const { data, error } = await createPublicClient()
    .from("gallery_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[data] gallery:", error.message);
    return FALLBACK_GALLERY;
  }
  return data as GalleryItem[];
}
