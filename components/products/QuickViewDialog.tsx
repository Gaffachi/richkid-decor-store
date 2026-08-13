"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/products/WishlistButton";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/lib/types";

export function QuickViewDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const onSale = product.salePrice != null && product.salePrice < product.price;
  const cover = product.images[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-square sm:aspect-auto">
            {cover && (
              <Image
                src={cover.url}
                alt={cover.altText}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <DialogHeader className="items-start text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {product.categoryName}
              </p>
              <DialogTitle className="font-heading text-2xl font-normal text-foreground">
                {product.name}
              </DialogTitle>
              {product.rating != null && (
                <div className="flex items-center gap-1 pt-1 text-sm text-muted-foreground">
                  <Star className="size-3.5 fill-primary text-primary" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span>({product.reviewCount ?? 0})</span>
                </div>
              )}
            </DialogHeader>

            <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </DialogDescription>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-heading text-2xl text-foreground">
                {formatPrice(onSale ? product.salePrice! : product.price)}
              </span>
              {onSale && (
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p
              className={cn(
                "mt-1 text-sm",
                product.stock > 0 ? "text-muted-foreground" : "text-destructive"
              )}
            >
              {product.stock > 0 ? "In stock, ready to ship" : "Out of stock"}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button
                className="flex-1 gap-2"
                disabled={product.stock === 0}
                onClick={() => {
                  addItem(product);
                  toast.success(`${product.name} added to cart.`);
                }}
              >
                <ShoppingBag className="size-4" />
                Add to Cart
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/product/${product.slug}`}>View Full Details</Link>
              </Button>
              <WishlistButton productId={product.id} className="static size-10 shrink-0" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
