"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/products/WishlistButton";
import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/lib/types";

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock === 0;

  function clamp(next: number) {
    setQuantity(Math.max(1, Math.min(product.stock || 1, next)));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Quantity</span>
        <div className="flex items-center rounded-full border border-border">
          <button
            onClick={() => clamp(quantity - 1)}
            disabled={outOfStock || quantity <= 1}
            aria-label="Decrease quantity"
            className="flex size-9 items-center justify-center text-foreground disabled:opacity-40"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => clamp(quantity + 1)}
            disabled={outOfStock || quantity >= product.stock}
            aria-label="Increase quantity"
            className="flex size-9 items-center justify-center text-foreground disabled:opacity-40"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Button
          size="lg"
          variant="outline"
          className="flex-1 gap-2"
          disabled={outOfStock}
          onClick={() => {
            addItem(product, quantity);
            toast.success(`${quantity} × ${product.name} added to cart.`);
          }}
        >
          <ShoppingBag className="size-4" />
          Add to Cart
        </Button>
        <Button
          size="lg"
          className="flex-1 gap-2"
          disabled={outOfStock}
          onClick={() => {
            addItem(product, quantity);
            router.push("/cart");
          }}
        >
          <Zap className="size-4" />
          Buy Now
        </Button>
        <WishlistButton productId={product.id} variant="inline" />
      </div>
    </div>
  );
}
