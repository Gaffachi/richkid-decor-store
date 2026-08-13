import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  hasHydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      addItem: (product, quantity = 1) => {
        const unitPrice =
          product.salePrice != null && product.salePrice < product.price
            ? product.salePrice
            : product.price;
        const existing = get().items.find((i) => i.productId === product.id);

        if (existing) {
          const nextQuantity = Math.min(existing.quantity + quantity, product.stock);
          set({
            items: get().items.map((i) =>
              i.productId === product.id ? { ...i, quantity: nextQuantity } : i
            ),
          });
          return;
        }

        set({
          items: [
            ...get().items,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.images[0]?.url ?? "",
              price: unitPrice,
              stock: product.stock,
              quantity: Math.min(quantity, product.stock),
            },
          ],
        });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "rds-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    }
  )
);

export function cartItemCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
