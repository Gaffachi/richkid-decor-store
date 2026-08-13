import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const currencyFormatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  minimumFractionDigits: 2,
});

export function formatPrice(amount: number) {
  return currencyFormatter.format(amount);
}
