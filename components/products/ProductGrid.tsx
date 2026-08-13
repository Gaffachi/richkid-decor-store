import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/lib/types";

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
