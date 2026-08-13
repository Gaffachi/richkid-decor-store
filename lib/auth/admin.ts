import "server-only";
import { getCurrentUser, type SessionUser } from "@/lib/auth/session";

/** Returns the current user only if they hold the admin role; otherwise null. */
export async function getAdminUser(): Promise<SessionUser | null> {
  const user = await getCurrentUser();
  return user?.role === "admin" ? user : null;
}
