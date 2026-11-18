import "server-only";
import { cookies } from "next/headers";
import { DEMO_COOKIE, isDemoMode, verifyAccessToken } from "./demo";

/**
 * Defence in depth for Server Actions: proxy.ts already blocks requests without a valid
 * demo cookie, but each mutation re-checks so a misconfigured matcher can never expose it.
 */
export async function assertDemoAccess(): Promise<void> {
  if (!isDemoMode()) return;
  const token = (await cookies()).get(DEMO_COOKIE)?.value;
  if (!verifyAccessToken(token)) throw new Error("Demo access required");
}
