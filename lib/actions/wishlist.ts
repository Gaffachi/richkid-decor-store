"use server";

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCurrentUser } from "@/lib/auth/session";

export async function toggleWishlistItem(productId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false as const,
      requiresAuth: true as const,
      error: "Sign in to save items to your wishlist.",
    };
  }

  const ref = getAdminDb()
    .collection("wishlists")
    .doc(user.uid)
    .collection("items")
    .doc(productId);

  const doc = await ref.get();
  if (doc.exists) {
    await ref.delete();
    return { ok: true as const, wishlisted: false };
  }

  await ref.set({ addedAt: FieldValue.serverTimestamp() });
  return { ok: true as const, wishlisted: true };
}

export async function getWishlistProductIds(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const snap = await getAdminDb()
      .collection("wishlists")
      .doc(user.uid)
      .collection("items")
      .get();
    return snap.docs.map((d) => d.id);
  } catch (error) {
    console.warn("[getWishlistProductIds] Firestore unavailable.", error);
    return [];
  }
}
