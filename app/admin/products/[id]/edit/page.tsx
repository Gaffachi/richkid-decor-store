import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAllCategories } from "@/lib/data/categories";
import { getProductBySlug } from "@/lib/data/products";

export const metadata: Metadata = { title: "Edit Product" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductBySlug(id), getAllCategories()]);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Edit Product</h1>
        <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
