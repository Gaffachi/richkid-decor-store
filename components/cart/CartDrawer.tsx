"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore, cartItemCount, cartSubtotal } from "@/lib/store/cart";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const count = hasHydrated ? cartItemCount(items) : 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Cart, ${count} items`} className="relative">
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-medium text-primary-foreground">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-[90vw] max-w-md flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart {count > 0 && `(${count})`}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Button variant="outline" onClick={() => setOpen(false)} asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border overflow-y-auto px-4">
              {items.map((item) => (
                <CartLineItem key={item.productId} item={item} compact />
              ))}
            </div>

            <SheetFooter className="flex-col gap-4 border-t border-border pt-4">
              <CartSummary subtotal={cartSubtotal(items)} />
              <div className="flex flex-col gap-2">
                <Button asChild size="lg" onClick={() => setOpen(false)}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="outline" onClick={() => setOpen(false)}>
                  <Link href="/cart">View Full Cart</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
