"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterPanel, type ShopFilterState } from "@/components/shop/FilterPanel";
import type { Category, Product, SortOption } from "@/lib/types";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
];

export function ShopClient({
  products,
  categories,
  initialSearch,
  initialCategory,
}: {
  products: Product[];
  categories: Category[];
  initialSearch?: string;
  initialCategory?: string;
}) {
  const [search, setSearch] = useState(initialSearch ?? "");
  const [sort, setSort] = useState<SortOption>("featured");
  const [filters, setFilters] = useState<ShopFilterState>({
    category: initialCategory ?? null,
    minPrice: "",
    maxPrice: "",
    inStockOnly: false,
    newArrivals: false,
    bestSellers: false,
    onSale: false,
  });

  const filtered = useMemo(() => {
    let result = products;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }
    if (filters.category) {
      result = result.filter((p) => p.categorySlug === filters.category);
    }
    const min = filters.minPrice ? Number(filters.minPrice) : null;
    const max = filters.maxPrice ? Number(filters.maxPrice) : null;
    if (min != null && !Number.isNaN(min)) {
      result = result.filter((p) => (p.salePrice ?? p.price) >= min);
    }
    if (max != null && !Number.isNaN(max)) {
      result = result.filter((p) => (p.salePrice ?? p.price) <= max);
    }
    if (filters.inStockOnly) result = result.filter((p) => p.stock > 0);
    if (filters.newArrivals) result = result.filter((p) => p.isNew);
    if (filters.bestSellers) result = result.filter((p) => p.bestSeller);
    if (filters.onSale) {
      result = result.filter((p) => p.salePrice != null && p.salePrice < p.price);
    }

    const sorted = [...result];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case "price-asc":
        sorted.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case "best-selling":
        sorted.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return sorted;
  }, [products, search, filters, sort]);

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.newArrivals ? 1 : 0) +
    (filters.bestSellers ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">
        <FilterPanel categories={categories} filters={filters} onChange={setFilters} />
      </aside>

      <div>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pr-8"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 lg:hidden">
                  <SlidersHorizontal className="size-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[0.65rem] text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-8">
                  <FilterPanel categories={categories} filters={filters} onChange={setFilters} />
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>

        <ProductGrid
          products={filtered}
          emptyMessage="No products match your filters. Try adjusting your search."
        />
      </div>
    </div>
  );
}
