"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/lib/store/wishlist";
import { toggleWishlistItem } from "@/lib/actions/wishlist";

export function WishlistButton({
  productId,
  variant = "icon",
  className,
}: {
  productId: string;
  variant?: "icon" | "inline";
  className?: string;
}) {
  const router = useRouter();
  const wishlisted = useWishlistStore((s) => s.has(productId));
  const add = useWishlistStore((s) => s.add);
  const remove = useWishlistStore((s) => s.remove);
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  const active = optimistic ?? wishlisted;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    setOptimistic(!active);
    startTransition(async () => {
      const result = await toggleWishlistItem(productId);

      if (!result.ok) {
        setOptimistic(null);
        if (result.requiresAuth) {
          toast.error(result.error, {
            action: { label: "Sign In", onClick: () => router.push("/account/login") },
          });
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        return;
      }

      setOptimistic(null);
      if (result.wishlisted) {
        add(productId);
        toast.success("Added to your wishlist.");
      } else {
        remove(productId);
        toast.success("Removed from your wishlist.");
      }
    });
  }

  if (variant === "inline") {
    return (
      <Button
        size="lg"
        variant="ghost"
        className={cn("gap-2 border border-border", className)}
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        onClick={handleClick}
        disabled={pending}
      >
        <Heart className={cn("size-4", active && "fill-primary text-primary")} />
        <span className="sm:hidden">Wishlist</span>
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn("rounded-full bg-background/90 shadow-sm backdrop-blur", className)}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={handleClick}
      disabled={pending}
    >
      <Heart className={cn("size-4", active && "fill-primary text-primary")} />
    </Button>
  );
}
