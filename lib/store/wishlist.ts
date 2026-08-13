import { create } from "zustand";

interface WishlistState {
  ids: Set<string>;
  hydrated: boolean;
  hydrate: (ids: string[]) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
}

/**
 * Client-side mirror of the signed-in user's Firestore wishlist. Populated
 * once via WishlistHydrator (fed by a server component that already knows
 * the current user) rather than fetched per-button, so every wishlist icon
 * on a page shares one source of truth without N individual reads.
 */
export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: new Set(),
  hydrated: false,
  hydrate: (ids) => set({ ids: new Set(ids), hydrated: true }),
  add: (productId) => set({ ids: new Set(get().ids).add(productId) }),
  remove: (productId) => {
    const next = new Set(get().ids);
    next.delete(productId);
    set({ ids: next });
  },
  has: (productId) => get().ids.has(productId),
}));
