import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getCurrentUser } from "@/lib/auth/session";
import { getWishlistProductIds } from "@/lib/actions/wishlist";
import { getProductsByIds } from "@/lib/data/products";

export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Heart className="size-7" />
        </div>
        <h1 className="mt-6 font-heading text-2xl text-foreground sm:text-3xl">
          Sign in to see your wishlist
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Save your favourite pieces to your account and pick up right where you left off.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/account/login?redirect=/wishlist">Sign In</Link>
        </Button>
      </div>
    );
  }

  const ids = await getWishlistProductIds();
  const products = await getProductsByIds(ids);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
          Saved by You
        </span>
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Your Wishlist</h1>
      </div>

      <ProductGrid
        products={products}
        emptyMessage="Nothing saved yet — tap the heart on any product to add it here."
      />
    </div>
  );
}
