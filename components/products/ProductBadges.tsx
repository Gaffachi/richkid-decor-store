import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function getProductBadges(product: Product): string[] {
  const badges: string[] = [];
  const onSale = product.salePrice != null && product.salePrice < product.price;

  if (onSale) badges.push("Sale");
  if (product.bestSeller) badges.push("Best Seller");
  if (product.isNew) badges.push("New");
  if (product.stock > 0 && product.stock <= 5) badges.push("Limited");

  return badges.slice(0, 2);
}

const badgeStyles: Record<string, string> = {
  Sale: "bg-primary text-primary-foreground",
  "Best Seller": "bg-foreground text-background",
  New: "bg-accent text-accent-foreground",
  Limited: "bg-destructive text-white",
};

export function ProductBadgeList({ product, className }: { product: Product; className?: string }) {
  const badges = getProductBadges(product);
  if (badges.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {badges.map((badge) => (
        <Badge
          key={badge}
          className={cn("rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wide shadow-sm", badgeStyles[badge])}
        >
          {badge}
        </Badge>
      ))}
    </div>
  );
}
