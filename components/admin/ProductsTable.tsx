"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/lib/actions/admin/products";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = await deleteProduct(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`${pendingDelete.name} deleted.`);
    router.refresh();
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No products yet.{" "}
        <Link href="/admin/products/new" className="text-primary hover:underline">
          Create your first product
        </Link>
        .
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                      {product.images[0] && (
                        <Image src={product.images[0].url} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{product.categoryName}</TableCell>
                <TableCell className="text-sm">
                  {formatPrice(product.salePrice ?? product.price)}
                  {product.salePrice != null && (
                    <span className="ml-1.5 text-xs text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  <span className={product.stock === 0 ? "text-destructive" : product.stock <= 5 ? "text-primary" : ""}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {product.featured && <Badge variant="secondary">Featured</Badge>}
                    {product.bestSeller && <Badge variant="secondary">Best Seller</Badge>}
                    {product.stock === 0 && <Badge variant="destructive">Out of Stock</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label={`Edit ${product.name}`}>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${product.name}`}
                      className="text-destructive hover:text-destructive"
                      onClick={() => setPendingDelete(product)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pendingDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the product from your store. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting} className="bg-destructive text-white hover:bg-destructive/90">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
