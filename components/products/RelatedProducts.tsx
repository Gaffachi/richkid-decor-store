import { ProductGrid } from "@/components/products/ProductGrid";
import type { Product } from "@/lib/types";

export function RelatedProducts({ title, products }: { title: string; products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="mb-6 font-heading text-2xl text-foreground">{title}</h2>
      <ProductGrid products={products} />
    </section>
  );
}
