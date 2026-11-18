import { NextResponse, type NextRequest } from "next/server";
import { DEMO_COOKIE } from "@/lib/demo";

/** Ends the demo session on this device. (POST only, so links/prefetches can't log people out.) */
export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/demo-access?signed_out=1", req.url), 303);
  res.cookies.set(DEMO_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
