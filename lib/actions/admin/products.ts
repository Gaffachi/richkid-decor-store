"use server";

import { revalidatePath, updateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminUser } from "@/lib/auth/admin";
import { productSchema, type ProductInput } from "@/lib/validations/product";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdminOrDeny(): Promise<ActionResult | null> {
  const admin = await getAdminUser();
  if (!admin) return { ok: false, error: "You must be an admin to do this." };
  return null;
}

function toFirestoreDoc(input: ProductInput, categoryName: string, categorySlug: string) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    salePrice: input.salePrice ?? null,
    stock: input.stock,
    sku: input.sku,
    categoryId: input.categoryId,
    categorySlug,
    categoryName,
    featured: input.featured,
    bestSeller: input.bestSeller,
    isNew: input.isNew,
    images: input.images.map((img, i) => ({ ...img, sortOrder: i })),
    attributes: {
      dimensions: input.dimensions || "",
      materials: input.materials || "",
      color: input.color || "",
      careInstructions: input.careInstructions || "",
    },
  };
}

export async function createProduct(rawInput: ProductInput): Promise<ActionResult> {
  const denied = await requireAdminOrDeny();
  if (denied) return denied;

  const parsed = productSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid product data." };
  }

  const db = getAdminDb();
  const categoryDoc = await db.collection("categories").doc(parsed.data.categoryId).get();
  if (!categoryDoc.exists) return { ok: false, error: "Selected category does not exist." };

  const ref = db.collection("products").doc(parsed.data.slug);
  const existing = await ref.get();
  if (existing.exists) {
    return { ok: false, error: "A product with this slug already exists." };
  }

  await ref.set({
    ...toFirestoreDoc(parsed.data, categoryDoc.data()!.name, categoryDoc.data()!.slug),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  updateTag("products");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { ok: true };
}

export async function updateProduct(
  productId: string,
  rawInput: ProductInput
): Promise<ActionResult> {
  const denied = await requireAdminOrDeny();
  if (denied) return denied;

  const parsed = productSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid product data." };
  }

  const db = getAdminDb();
  const categoryDoc = await db.collection("categories").doc(parsed.data.categoryId).get();
  if (!categoryDoc.exists) return { ok: false, error: "Selected category does not exist." };

  if (parsed.data.slug !== productId) {
    const slugTaken = await db.collection("products").doc(parsed.data.slug).get();
    if (slugTaken.exists) return { ok: false, error: "A product with this slug already exists." };
  }

  const data = {
    ...toFirestoreDoc(parsed.data, categoryDoc.data()!.name, categoryDoc.data()!.slug),
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (parsed.data.slug !== productId) {
    // Slug (doc ID) changed: create the new doc, copy createdAt, delete the old one.
    const oldDoc = await db.collection("products").doc(productId).get();
    await db
      .collection("products")
      .doc(parsed.data.slug)
      .set({ ...data, createdAt: oldDoc.data()?.createdAt ?? FieldValue.serverTimestamp() });
    await db.collection("products").doc(productId).delete();
  } else {
    await db.collection("products").doc(productId).update(data);
  }

  updateTag("products");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/product/${productId}`);
  revalidatePath(`/product/${parsed.data.slug}`);
  return { ok: true };
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  const denied = await requireAdminOrDeny();
  if (denied) return denied;

  await getAdminDb().collection("products").doc(productId).delete();

  updateTag("products");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { ok: true };
}
