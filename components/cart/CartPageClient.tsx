"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";

export function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  if (hasHydrated && items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" />
        <h2 className="mt-4 font-heading text-xl text-foreground">Your cart is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse the collection and find something beautiful for your space.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
      <div className="divide-y divide-border">
        {items.map((item) => (
          <CartLineItem key={item.productId} item={item} />
        ))}
      </div>

      <div className="h-fit rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg text-foreground">Order Summary</h2>
        <div className="mt-4">
          <CartSummary subtotal={cartSubtotal(items)} />
        </div>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
