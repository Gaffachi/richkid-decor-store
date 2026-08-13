import "server-only";
import { unstable_cache } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import type { Category } from "@/lib/types";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

function toCategory(doc: QueryDocumentSnapshot): Category {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    slug: data.slug,
    description: data.description ?? "",
    image: data.image ?? "",
    isSecondary: data.isSecondary ?? false,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}

/**
 * Falls back to an empty list (instead of throwing) until Firebase is configured
 * and seeded, so pages render cleanly during initial setup.
 *
 * Cached for 60s (tag "categories") — read on nearly every page (header nav,
 * homepage, sitemap) but written only from the admin dashboard, which busts
 * the cache immediately via revalidateTag("categories").
 */
export const getAllCategories = unstable_cache(
  async (): Promise<Category[]> => {
    try {
      const snap = await getAdminDb().collection("categories").orderBy("name").get();
      return snap.docs.map(toCategory);
    } catch (error) {
      console.warn("[getAllCategories] Firestore unavailable — returning empty list.", error);
      return [];
    }
  },
  ["categories:all"],
  { tags: ["categories"], revalidate: 60 }
);

export async function getPrimaryCategories(): Promise<Category[]> {
  const categories = await getAllCategories();
  return categories.filter((c) => !c.isSecondary);
}

export const getCategoryBySlug = unstable_cache(
  async (slug: string): Promise<Category | null> => {
    try {
      const snap = await getAdminDb()
        .collection("categories")
        .where("slug", "==", slug)
        .limit(1)
        .get();
      if (snap.empty) return null;
      return toCategory(snap.docs[0]);
    } catch (error) {
      console.warn("[getCategoryBySlug] Firestore unavailable.", error);
      return null;
    }
  },
  ["categories:by-slug"],
  { tags: ["categories"], revalidate: 60 }
);
