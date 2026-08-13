import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="mb-8 font-heading text-3xl text-foreground sm:text-4xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
