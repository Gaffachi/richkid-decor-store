import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";
import { getUserProfile } from "@/lib/data/users";

export const SESSION_COOKIE_NAME = "rds_session";
export const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export interface SessionUser {
  uid: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

/** Reads and verifies the session cookie server-side. Returns null if missing, expired, or invalid. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    const profile = await getUserProfile(decoded.uid);
    return {
      uid: decoded.uid,
      email: decoded.email ?? profile?.email ?? "",
      name: profile?.name || decoded.name || "Customer",
      role: profile?.role ?? "customer",
    };
  } catch {
    return null;
  }
}
