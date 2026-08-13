import { z } from "zod";

const imageSchema = z.object({
  url: z.string().trim().url("Enter a valid image URL."),
  altText: z.string().trim().min(1, "Alt text helps accessibility and SEO."),
});

export const productSchema = z
  .object({
    name: z.string().trim().min(2, "Enter a product name."),
    slug: z
      .string()
      .trim()
      .min(2, "Enter a URL slug.")
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
    description: z.string().trim().min(10, "Enter a description of at least 10 characters."),
    price: z.coerce.number().positive("Price must be greater than 0."),
    salePrice: z.coerce.number().positive().nullable().optional(),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
    sku: z.string().trim().min(1, "Enter a SKU."),
    categoryId: z.string().min(1, "Select a category."),
    featured: z.boolean().default(false),
    bestSeller: z.boolean().default(false),
    isNew: z.boolean().default(false),
    images: z.array(imageSchema).min(1, "Add at least one product image."),
    dimensions: z.string().trim().optional(),
    materials: z.string().trim().optional(),
    color: z.string().trim().optional(),
    careInstructions: z.string().trim().optional(),
  })
  .refine((data) => data.salePrice == null || data.salePrice < data.price, {
    message: "Sale price must be lower than the regular price.",
    path: ["salePrice"],
  });

export type ProductInput = z.infer<typeof productSchema>;
