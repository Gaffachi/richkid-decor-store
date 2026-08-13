import type { Metadata } from "next";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { getAllOrders } from "@/lib/data/orders";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">{orders.length} total</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
