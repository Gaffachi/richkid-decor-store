import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";

export function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No orders yet — they&rsquo;ll appear here once checkout is live.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-foreground hover:text-primary">
                  #{order.id.slice(0, 8)}
                </Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{order.shipping?.name || "—"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant={order.paymentStatus === "paid" ? "secondary" : "outline"}>
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-sm font-medium">{formatPrice(order.total)}</TableCell>
              <TableCell>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
