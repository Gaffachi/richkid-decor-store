import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/ShopClient";
import { getAllProducts } from "@/lib/data/products";
import { getAllCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse the full RichKid Decor Store catalogue — home décor and phone accessories, searchable, filterable and sortable.",
  // Search/category filters are query params on this same route (e.g. ?search=rug) —
  // canonicalize them all back to the plain listing so filtered URLs aren't indexed
  // as separate near-duplicate pages.
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
          The Full Collection
        </span>
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Shop All Products</h1>
      </div>

      <ShopClient
        products={products}
        categories={categories}
        initialSearch={params.search}
        initialCategory={params.category}
      />
    </div>
  );
}
