"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/lib/store/wishlist";

export function WishlistHydrator({ ids }: { ids: string[] }) {
  const hydrate = useWishlistStore((s) => s.hydrate);

  useEffect(() => {
    hydrate(ids);
    // Only re-hydrate when the server-known id set actually changes shape.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(","), hydrate]);

  return null;
}
