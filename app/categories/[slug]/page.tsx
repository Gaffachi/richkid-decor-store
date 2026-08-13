import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: category.name,
      description: category.description,
      images: category.image ? [{ url: category.image }] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.slug);

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        <Image src={category.image} alt={category.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="font-heading text-3xl text-white sm:text-4xl">{category.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{category.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <p className="mb-6 text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
        <ProductGrid
          products={products}
          emptyMessage="No products in this category yet — check back soon."
        />
      </div>
    </div>
  );
}
