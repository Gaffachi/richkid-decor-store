import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getFeaturedProducts } from "@/lib/data/products";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Handpicked for You
          </span>
          <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
            Featured Products
          </h2>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/shop">
            Shop All <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <ProductGrid
        products={products}
        emptyMessage="Featured products will appear here once the store is connected to Firestore and seeded."
      />
    </section>
  );
}
