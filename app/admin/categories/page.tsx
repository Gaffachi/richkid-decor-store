import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoriesTable } from "@/components/admin/CategoriesTable";
import { getAllCategories } from "@/lib/data/categories";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">{categories.length} total</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/categories/new">
            <Plus className="size-4" /> New Category
          </Link>
        </Button>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  );
}
