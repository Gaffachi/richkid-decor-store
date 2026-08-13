import "server-only";
import { unstable_cache } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import type { Product, ProductFilters, SortOption } from "@/lib/types";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

function toProduct(doc: QueryDocumentSnapshot): Product {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    slug: data.slug,
    description: data.description ?? "",
    price: data.price ?? 0,
    salePrice: data.salePrice ?? null,
    stock: data.stock ?? 0,
    sku: data.sku ?? "",
    categoryId: data.categoryId ?? "",
    categorySlug: data.categorySlug ?? "",
    categoryName: data.categoryName ?? "",
    featured: !!data.featured,
    bestSeller: !!data.bestSeller,
    isNew: !!data.isNew,
    images: data.images ?? [],
    attributes: data.attributes ?? undefined,
    rating: data.rating ?? undefined,
    reviewCount: data.reviewCount ?? undefined,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}

/**
 * The catalogue is small enough (boutique décor store, not a marketplace) that
 * fetching the full collection once per request and filtering/sorting in memory
 * is simpler and cheaper than composing many Firestore composite indexes.
 * Falls back to an empty list (instead of throwing) until Firebase is configured
 * and seeded, so pages render cleanly during initial setup.
 *
 * Cached for 60s (tag "products") since almost every read in this file derives
 * from it — one cached Firestore read serves the homepage, shop, categories,
 * and product pages instead of one read per request. Admin writes bust the
 * cache immediately via revalidateTag("products").
 */
export const getAllProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const snap = await getAdminDb().collection("products").orderBy("createdAt", "desc").get();
      return snap.docs.map(toProduct);
    } catch (error) {
      console.warn("[getAllProducts] Firestore unavailable — returning empty list.", error);
      return [];
    }
  },
  ["products:all"],
  { tags: ["products"], revalidate: 60 }
);

export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    try {
      const snap = await getAdminDb()
        .collection("products")
        .where("slug", "==", slug)
        .limit(1)
        .get();
      if (snap.empty) return null;
      return toProduct(snap.docs[0]);
    } catch (error) {
      console.warn("[getProductBySlug] Firestore unavailable.", error);
      return null;
    }
  },
  ["products:by-slug"],
  { tags: ["products"], revalidate: 60 }
);

export async function getFeaturedProducts(max = 8): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.featured).slice(0, max);
}

export async function getBestSellers(max = 8): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.bestSeller).slice(0, max);
}

export async function getNewArrivals(max = 8): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.isNew).slice(0, max);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.categorySlug === categorySlug);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const products = await getAllProducts();
  const idSet = new Set(ids);
  return products.filter((p) => idSet.has(p.id));
}

export async function getRelatedProducts(product: Product, max = 4): Promise<Product[]> {
  const products = await getAllProducts();
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, max);
}

/**
 * Cross-sell pulled from other décor categories, so a living-room piece can
 * surface wall décor, lighting or table décor rather than more of itself.
 */
export async function getCompleteTheLookProducts(product: Product, max = 4): Promise<Product[]> {
  const products = await getAllProducts();
  return products
    .filter(
      (p) =>
        p.categorySlug !== product.categorySlug &&
        p.categorySlug !== "phone-accessories" &&
        p.id !== product.id
    )
    .slice(0, max);
}

function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = products;

  if (filters.category) {
    result = result.filter((p) => p.categorySlug === filters.category);
  }
  if (filters.minPrice != null) {
    result = result.filter((p) => (p.salePrice ?? p.price) >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    result = result.filter((p) => (p.salePrice ?? p.price) <= filters.maxPrice!);
  }
  if (filters.inStockOnly) {
    result = result.filter((p) => p.stock > 0);
  }
  if (filters.newArrivals) {
    result = result.filter((p) => p.isNew);
  }
  if (filters.bestSellers) {
    result = result.filter((p) => p.bestSeller);
  }
  if (filters.onSale) {
    result = result.filter((p) => p.salePrice != null && p.salePrice < p.price);
  }
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }

  return result;
}

function applySort(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    case "price-asc":
      return sorted.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    case "price-desc":
      return sorted.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    case "best-selling":
      return sorted.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
    case "featured":
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export async function getFilteredProducts(
  filters: ProductFilters = {},
  sort: SortOption = "featured"
): Promise<Product[]> {
  const products = await getAllProducts();
  return applySort(applyFilters(products, filters), sort);
}
