"use server";

import { revalidatePath, updateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminUser } from "@/lib/auth/admin";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdminOrDeny(): Promise<ActionResult | null> {
  const admin = await getAdminUser();
  if (!admin) return { ok: false, error: "You must be an admin to do this." };
  return null;
}

export async function createCategory(rawInput: CategoryInput): Promise<ActionResult> {
  const denied = await requireAdminOrDeny();
  if (denied) return denied;

  const parsed = categorySchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid category data." };
  }

  const ref = getAdminDb().collection("categories").doc(parsed.data.slug);
  const existing = await ref.get();
  if (existing.exists) return { ok: false, error: "A category with this slug already exists." };

  await ref.set({ ...parsed.data, createdAt: FieldValue.serverTimestamp() });

  updateTag("categories");
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
  return { ok: true };
}

export async function updateCategory(
  categoryId: string,
  rawInput: CategoryInput
): Promise<ActionResult> {
  const denied = await requireAdminOrDeny();
  if (denied) return denied;

  const parsed = categorySchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid category data." };
  }

  const db = getAdminDb();

  if (parsed.data.slug !== categoryId) {
    const slugTaken = await db.collection("categories").doc(parsed.data.slug).get();
    if (slugTaken.exists) {
      return { ok: false, error: "A category with this slug already exists." };
    }
    const oldDoc = await db.collection("categories").doc(categoryId).get();
    await db
      .collection("categories")
      .doc(parsed.data.slug)
      .set({ ...parsed.data, createdAt: oldDoc.data()?.createdAt ?? FieldValue.serverTimestamp() });
    await db.collection("categories").doc(categoryId).delete();
    // Products referencing the old category id/slug are intentionally left as-is;
    // renaming a category slug after products exist under it is an edge case
    // outside this phase's scope (products would need a bulk re-tag pass).
  } else {
    await db.collection("categories").doc(categoryId).update({ ...parsed.data });
  }

  updateTag("categories");
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteCategory(categoryId: string): Promise<ActionResult> {
  const denied = await requireAdminOrDeny();
  if (denied) return denied;

  const db = getAdminDb();
  const inUse = await db
    .collection("products")
    .where("categoryId", "==", categoryId)
    .limit(1)
    .get();
  if (!inUse.empty) {
    return { ok: false, error: "Cannot delete a category that still has products in it." };
  }

  await db.collection("categories").doc(categoryId).delete();

  updateTag("categories");
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { ok: true };
}
