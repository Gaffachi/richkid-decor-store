import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { getAllProducts } from "@/lib/data/products";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} total</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/products/new">
            <Plus className="size-4" /> New Product
          </Link>
        </Button>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
