import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAllCategories } from "@/lib/data/categories";

export const metadata: Metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground sm:text-3xl">New Product</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add a new product to the catalogue.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
