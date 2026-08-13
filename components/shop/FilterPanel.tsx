"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export interface ShopFilterState {
  category: string | null;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  newArrivals: boolean;
  bestSellers: boolean;
  onSale: boolean;
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-border accent-primary"
      />
      {label}
    </label>
  );
}

export function FilterPanel({
  categories,
  filters,
  onChange,
  className,
}: {
  categories: Category[];
  filters: ShopFilterState;
  onChange: (filters: ShopFilterState) => void;
  className?: string;
}) {
  function update<K extends keyof ShopFilterState>(key: K, value: ShopFilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <h3 className="mb-3 font-heading text-sm font-medium text-foreground">Category</h3>
        <div className="flex flex-col">
          <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-foreground">
            <input
              type="radio"
              name="category"
              checked={filters.category === null}
              onChange={() => update("category", null)}
              className="size-4 accent-primary"
            />
            All Categories
          </label>
          {categories.map((category) => (
            <label
              key={category.slug}
              className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-foreground"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === category.slug}
                onChange={() => update("category", category.slug)}
                className="size-4 accent-primary"
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 font-heading text-sm font-medium text-foreground">Price (GHS)</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="min-price" className="sr-only">
              Minimum price
            </Label>
            <Input
              id="min-price"
              type="number"
              min={0}
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => update("minPrice", e.target.value)}
            />
          </div>
          <span className="text-muted-foreground">–</span>
          <div className="flex-1">
            <Label htmlFor="max-price" className="sr-only">
              Maximum price
            </Label>
            <Input
              id="max-price"
              type="number"
              min={0}
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => update("maxPrice", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 font-heading text-sm font-medium text-foreground">Availability</h3>
        <Checkbox
          checked={filters.inStockOnly}
          onChange={(v) => update("inStockOnly", v)}
          label="In stock only"
        />
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 font-heading text-sm font-medium text-foreground">Highlights</h3>
        <Checkbox
          checked={filters.newArrivals}
          onChange={(v) => update("newArrivals", v)}
          label="New Arrivals"
        />
        <Checkbox
          checked={filters.bestSellers}
          onChange={(v) => update("bestSellers", v)}
          label="Best Sellers"
        />
        <Checkbox checked={filters.onSale} onChange={(v) => update("onSale", v)} label="On Sale" />
      </div>
    </div>
  );
}
