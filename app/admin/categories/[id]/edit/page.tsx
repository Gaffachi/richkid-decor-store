import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategoryBySlug } from "@/lib/data/categories";

export const metadata: Metadata = { title: "Edit Category" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await getCategoryBySlug(id);
  if (!category) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Edit Category</h1>
        <p className="mt-1 text-sm text-muted-foreground">{category.name}</p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
