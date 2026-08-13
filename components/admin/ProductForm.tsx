"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudinaryUploadButton } from "@/components/admin/CloudinaryUploadButton";
import { createProduct, updateProduct } from "@/lib/actions/admin/products";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import type { Category, Product } from "@/lib/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toFormState(product?: Product): ProductInput {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    salePrice: product?.salePrice ?? null,
    stock: product?.stock ?? 0,
    sku: product?.sku ?? "",
    categoryId: product?.categoryId ?? "",
    featured: product?.featured ?? false,
    bestSeller: product?.bestSeller ?? false,
    isNew: product?.isNew ?? false,
    images: product?.images?.length
      ? product.images.map((img) => ({ url: img.url, altText: img.altText }))
      : [{ url: "", altText: "" }],
    dimensions: product?.attributes?.dimensions ?? "",
    materials: product?.attributes?.materials ?? "",
    color: product?.attributes?.color ?? "",
    careInstructions: product?.attributes?.careInstructions ?? "",
  };
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEditing = !!product;
  const [form, setForm] = useState<ProductInput>(toFormState(product));
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleNameChange(name: string) {
    update("name", name);
    if (!slugTouched) update("slug", slugify(name));
  }

  function updateImage(index: number, field: "url" | "altText", value: string) {
    const images = [...form.images];
    images[index] = { ...images[index], [field]: value };
    update("images", images);
  }

  function addImageRow() {
    update("images", [...form.images, { url: "", altText: "" }]);
  }

  function removeImageRow(index: number) {
    update(
      "images",
      form.images.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = productSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error(parsed.error.issues[0]?.message ?? "Please fix the errors below.");
      return;
    }
    setErrors({});
    setSubmitting(true);

    const result = isEditing
      ? await updateProduct(product.id, parsed.data)
      : await createProduct(parsed.data);

    if (!result.ok) {
      toast.error(result.error);
      setSubmitting(false);
      return;
    }

    toast.success(isEditing ? "Product updated." : "Product created.");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-heading text-lg text-foreground">Basics</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug", slugify(e.target.value));
              }}
            />
            <p className="text-xs text-muted-foreground">/product/{form.slug || "…"}</p>
            {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" value={form.sku} onChange={(e) => update("sku", e.target.value)} />
            {errors.sku && <p className="text-xs text-destructive">{errors.sku}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={form.categoryId} onValueChange={(v) => update("categoryId", v)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-heading text-lg text-foreground">Pricing & Stock</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price (GHS)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value))}
            />
            {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="salePrice">Sale Price (optional)</Label>
            <Input
              id="salePrice"
              type="number"
              min={0}
              step="0.01"
              value={form.salePrice ?? ""}
              onChange={(e) => update("salePrice", e.target.value ? Number(e.target.value) : null)}
            />
            {errors.salePrice && <p className="text-xs text-destructive">{errors.salePrice}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => update("stock", Number(e.target.value))}
            />
            {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5">
            <Switch checked={form.featured} onCheckedChange={(v) => update("featured", v)} />
            <span className="text-sm text-foreground">Featured</span>
          </label>
          <label className="flex items-center gap-2.5">
            <Switch checked={form.bestSeller} onCheckedChange={(v) => update("bestSeller", v)} />
            <span className="text-sm text-foreground">Best Seller</span>
          </label>
          <label className="flex items-center gap-2.5">
            <Switch checked={form.isNew} onCheckedChange={(v) => update("isNew", v)} />
            <span className="text-sm text-foreground">New Arrival</span>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg text-foreground">Images</h2>
          <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addImageRow}>
            <Plus className="size-3.5" /> Add Image
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Upload a photo or paste an image URL. The first image is the main product image.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {form.images.map((image, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-border/70 p-3 sm:flex-row sm:items-start">
              <CloudinaryUploadButton
                onUploaded={(url) => {
                  updateImage(i, "url", url);
                  if (!form.images[i].altText) updateImage(i, "altText", form.name);
                }}
              />
              <div className="flex-1">
                <Input
                  placeholder="https://..."
                  value={image.url}
                  onChange={(e) => updateImage(i, "url", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Alt text"
                  value={image.altText}
                  onChange={(e) => updateImage(i, "altText", e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive"
                onClick={() => removeImageRow(i)}
                disabled={form.images.length === 1}
                aria-label="Remove image"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        {errors.images && <p className="mt-2 text-xs text-destructive">{errors.images}</p>}
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-heading text-lg text-foreground">Details (optional)</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input id="dimensions" value={form.dimensions} onChange={(e) => update("dimensions", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="materials">Materials</Label>
            <Input id="materials" value={form.materials} onChange={(e) => update("materials", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="color">Color</Label>
            <Input id="color" value={form.color} onChange={(e) => update("color", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="careInstructions">Care Instructions</Label>
            <Input
              id="careInstructions"
              value={form.careInstructions}
              onChange={(e) => update("careInstructions", e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
