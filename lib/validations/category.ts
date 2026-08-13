import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Enter a category name."),
  slug: z
    .string()
    .trim()
    .min(2, "Enter a URL slug.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  description: z.string().trim().min(5, "Enter a short description."),
  image: z.string().trim().url("Enter a valid image URL."),
  isSecondary: z.boolean().default(false),
});

export type CategoryInput = z.infer<typeof categorySchema>;
