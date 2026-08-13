"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CloudinaryUploadButton } from "@/components/admin/CloudinaryUploadButton";
import { createCategory, updateCategory } from "@/lib/actions/admin/categories";
import { categorySchema, type CategoryInput } from "@/lib/validations/category";
import type { Category } from "@/lib/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const isEditing = !!category;
  const [form, setForm] = useState<CategoryInput>({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    image: category?.image ?? "",
    isSecondary: category?.isSecondary ?? false,
  });
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof CategoryInput>(key: K, value: CategoryInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = categorySchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      toast.error(parsed.error.issues[0]?.message ?? "Please fix the errors below.");
      return;
    }
    setErrors({});
    setSubmitting(true);

    const result = isEditing
      ? await updateCategory(category.id, parsed.data)
      : await createCategory(parsed.data);

    if (!result.ok) {
      toast.error(result.error);
      setSubmitting(false);
      return;
    }

    toast.success(isEditing ? "Category updated." : "Category created.");
    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5 rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => {
            update("name", e.target.value);
            if (!slugTouched) update("slug", slugify(e.target.value));
          }}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          id="slug"
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            update("slug", slugify(e.target.value));
          }}
        />
        <p className="text-xs text-muted-foreground">/categories/{form.slug || "…"}</p>
        {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="image">Category Image</Label>
        <div className="flex items-start gap-2">
          <CloudinaryUploadButton onUploaded={(url) => update("image", url)} />
          <Input
            id="image"
            placeholder="https://..."
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            className="flex-1"
          />
        </div>
        {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}
      </div>

      <label className="flex items-center gap-2.5">
        <Switch checked={form.isSecondary} onCheckedChange={(v) => update("isSecondary", v)} />
        <span className="text-sm text-foreground">Secondary category (e.g. Phone Accessories)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Category"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
