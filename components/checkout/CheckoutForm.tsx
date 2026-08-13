"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import { createOrder } from "@/lib/actions/checkout";
import { checkoutSchema } from "@/lib/validations/checkout";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    instructions: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = checkoutSchema.safeParse({
      ...form,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    setErrors({});
    setSubmitting(true);

    const result = await createOrder(parsed.data);
    if (!result.ok) {
      toast.error(result.error);
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push(`/order-confirmation/${result.orderId}`);
  }

  if (hasHydrated && items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" />
        <h2 className="mt-4 font-heading text-xl text-foreground">Your cart is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add something beautiful before checking out.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-heading text-lg text-foreground">Delivery Details</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="024 000 0000" />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="address">Delivery Address / Nearest Parcel Station</Label>
              <Input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} />
              <p className="text-xs text-muted-foreground">
                We&apos;ll confirm the closest parcel office or car station with you on
                WhatsApp — the delivery fee is paid there in cash when you collect your order.
              </p>
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} />
              {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="region">Region</Label>
              <Input id="region" value={form.region} onChange={(e) => update("region", e.target.value)} />
              {errors.region && <p className="text-xs text-destructive">{errors.region}</p>}
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="instructions">Delivery Instructions (optional)</Label>
              <Textarea
                id="instructions"
                rows={3}
                value={form.instructions}
                onChange={(e) => update("instructions", e.target.value)}
                placeholder="Landmark, preferred delivery time, etc."
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-heading text-lg text-foreground">Your Items</h2>
          <div className="mt-2 divide-y divide-border">
            {items.map((item) => (
              <CartLineItem key={item.productId} item={item} compact />
            ))}
          </div>
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg text-foreground">Order Summary</h2>
        <div className="mt-4">
          <CartSummary subtotal={cartSubtotal(items)} />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          We don&rsquo;t take payment on the site. After you submit, you&rsquo;ll be taken to
          WhatsApp to confirm your order, delivery and payment with us directly.
        </p>
        <Button type="submit" size="lg" className="mt-5 w-full gap-2" disabled={submitting}>
          <MessageCircle className="size-4" />
          {submitting ? "Placing Order..." : "Send Order via WhatsApp"}
        </Button>
      </div>
    </form>
  );
}
