"use server";

import { z } from "zod";
import { getAdminAuth } from "@/lib/firebase/admin";
import { createUserProfile } from "@/lib/data/users";
import { registerSchema } from "@/lib/validations/auth";

const inputSchema = z.object({
  idToken: z.string().min(1),
  name: registerSchema.shape.name,
  phone: registerSchema.shape.phone,
});

/**
 * Creates the Firestore user profile after Firebase Auth account creation.
 * The idToken is verified server-side so uid/email are authoritative — only
 * the non-security-critical name/phone fields come from client form input.
 */
export async function registerUserProfile(input: {
  idToken: string;
  name: string;
  phone: string;
}) {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(parsed.data.idToken);
    await createUserProfile(decoded.uid, {
      name: parsed.data.name,
      email: decoded.email ?? "",
      phone: parsed.data.phone,
    });
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Could not create your profile. Please try again." };
  }
}
