"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductBadgeList } from "@/components/products/ProductBadges";
import { QuickViewDialog } from "@/components/products/QuickViewDialog";
import { WishlistButton } from "@/components/products/WishlistButton";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/lib/types";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const onSale = product.salePrice != null && product.salePrice < product.price;
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] ?? primaryImage;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn("group relative flex flex-col", className)}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
          <Link href={`/product/${product.slug}`} className="block h-full w-full" aria-label={product.name}>
            {primaryImage && (
              <>
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.altText}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                <Image
                  src={secondaryImage.url}
                  alt={secondaryImage.altText}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </>
            )}
          </Link>

          <ProductBadgeList product={product} className="absolute left-3 top-3" />

          <WishlistButton
            productId={product.id}
            className="absolute right-3 top-3 size-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
          />

          <div className="absolute inset-x-3 bottom-3 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              variant="secondary"
              className="h-9 flex-1 gap-1.5 bg-background/95 text-xs font-medium backdrop-blur hover:bg-background"
              onClick={() => setQuickViewOpen(true)}
            >
              <Eye className="size-3.5" /> Quick View
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0"
              aria-label="Add to cart"
              disabled={product.stock === 0}
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
                toast.success(`${product.name} added to cart.`);
              }}
            >
              <ShoppingBag className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-3.5 flex flex-col gap-0.5">
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {product.categoryName}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-heading text-base font-normal text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm font-medium text-foreground">
              {formatPrice(onSale ? product.salePrice! : product.price)}
            </span>
            {onSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <QuickViewDialog product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </>
  );
}
