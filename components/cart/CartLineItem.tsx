"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore, type CartItem } from "@/lib/store/cart";

export function CartLineItem({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-3 py-4">
      <Link
        href={`/product/${item.slug}`}
        className={compact ? "relative size-16 shrink-0 overflow-hidden rounded-lg bg-secondary" : "relative size-20 shrink-0 overflow-hidden rounded-lg bg-secondary sm:size-24"}
      >
        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary">
            {item.name}
          </Link>
          <button
            onClick={() => removeItem(item.productId)}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-full border border-border">
            <button
              onClick={() => setQuantity(item.productId, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex size-7 items-center justify-center text-foreground"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
            <button
              onClick={() => setQuantity(item.productId, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              aria-label="Increase quantity"
              className="flex size-7 items-center justify-center text-foreground disabled:opacity-40"
            >
              <Plus className="size-3" />
            </button>
          </div>
          <span className="text-sm font-medium text-foreground">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
