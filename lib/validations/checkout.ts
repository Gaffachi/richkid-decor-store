import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.")]).optional(),
  phone: z
    .string()
    .trim()
    .min(9, "Enter a valid phone number.")
    .max(20, "Enter a valid phone number."),
  address: z.string().trim().min(5, "Enter your delivery address."),
  city: z.string().trim().min(2, "Enter your city."),
  region: z.string().trim().min(2, "Enter your region."),
  instructions: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1, "Your cart is empty."),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
