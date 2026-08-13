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
import { deleteCategory } from "@/lib/actions/admin/categories";
import type { Category } from "@/lib/types";

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = await deleteCategory(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`${pendingDelete.name} deleted.`);
    router.refresh();
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No categories yet.{" "}
        <Link href="/admin/categories/new" className="text-primary hover:underline">
          Create your first category
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
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                      {category.image && (
                        <Image src={category.image} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{category.name}</p>
                      <p className="text-xs text-muted-foreground">/{category.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={category.isSecondary ? "outline" : "secondary"}>
                    {category.isSecondary ? "Secondary" : "Primary"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label={`Edit ${category.name}`}>
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${category.name}`}
                      className="text-destructive hover:text-destructive"
                      onClick={() => setPendingDelete(category)}
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
              Categories with products in them can&rsquo;t be deleted. This cannot be undone.
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
