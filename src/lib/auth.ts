import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSessionClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import { assertDemoAccess } from "./demo-server";

/**
 * Data Access Layer for the admin area.
 * Verifies the user with the Supabase Auth server (getUser) AND checks admin membership
 * (is_admin() in Postgres). Every admin page and Server Action calls this.
 */
export async function getAdmin() {
  // Admin data is always per-request (session cookies, clock-based token checks).
  await connection();
  await assertDemoAccess();
  if (!isSupabaseConfigured) return null;
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) return null;
  return { supabase, user: { id: user.id, email: user.email ?? "" } };
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
