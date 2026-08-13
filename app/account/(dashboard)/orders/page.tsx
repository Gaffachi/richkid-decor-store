import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/session";
import { getOrdersByUserId } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const orders = user ? await getOrdersByUserId(user.uid) : [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border p-10 text-center sm:p-14">
        <Package className="size-8 text-muted-foreground" />
        <h2 className="mt-4 font-heading text-lg text-foreground">No orders yet</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Your order history will appear here once you place your first order.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/order-confirmation/${order.id}`}
          className="flex items-center justify-between gap-4 p-5 hover:bg-secondary/40"
        >
          <div>
            <p className="text-sm font-medium text-foreground">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()} · {order.items.length}{" "}
              {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{order.status}</Badge>
            <span className="text-sm font-medium text-foreground">{formatPrice(order.total)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
