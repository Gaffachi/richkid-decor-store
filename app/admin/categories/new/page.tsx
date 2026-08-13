import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "New Category" };

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground sm:text-3xl">New Category</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add a new category to the store.</p>
      </div>
      <CategoryForm />
    </div>
  );
}
