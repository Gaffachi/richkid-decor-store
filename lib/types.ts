export type ProductBadge = "New" | "Best Seller" | "Limited" | "Sale";

export interface ProductImage {
  url: string;
  altText: string;
  sortOrder: number;
}

export interface ProductAttributes {
  dimensions?: string;
  materials?: string;
  color?: string;
  careInstructions?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  sku: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  images: ProductImage[];
  attributes?: ProductAttributes;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  /** Home décor categories are shown prominently; phone accessories is secondary. */
  isSecondary?: boolean;
  createdAt: string;
}

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "best-selling";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  newArrivals?: boolean;
  bestSellers?: boolean;
  onSale?: boolean;
  search?: string;
}

export const ORDER_STATUSES = [
  "Pending",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface ShippingInfo {
  name: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  instructions?: string;
}

export interface Order {
  id: string;
  /** Null for guest checkouts (no account required to order). */
  userId: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  shipping: ShippingInfo;
  items: OrderItem[];
  paystackReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  createdAt: string;
  orderCount: number;
}
