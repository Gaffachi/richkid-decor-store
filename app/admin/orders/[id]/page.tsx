import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { getOrderById } from "@/lib/data/orders";

export const metadata: Metadata = { title: "Order Details" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground sm:text-3xl">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-heading text-lg text-foreground">Items</h2>
          <div className="mt-4 divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 py-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                  {item.image && <Image src={item.image} alt="" fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>Paid at pickup</span>
            </div>
            <div className="flex justify-between font-heading text-base">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-heading text-lg text-foreground">Customer</h2>
            <div className="mt-3 flex flex-col gap-1 text-sm">
              <p className="font-medium text-foreground">{order.shipping.name}</p>
              <p className="text-muted-foreground">{order.shipping.email}</p>
              <p className="text-muted-foreground">{order.shipping.phone}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-heading text-lg text-foreground">Delivery</h2>
            <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
              <p>{order.shipping.address}</p>
              <p>
                {order.shipping.city}, {order.shipping.region}
              </p>
              {order.shipping.instructions && <p className="mt-2">{order.shipping.instructions}</p>}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-heading text-lg text-foreground">Payment</h2>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={order.paymentStatus === "paid" ? "secondary" : "outline"}>
                {order.paymentStatus}
              </Badge>
            </div>
            {order.paystackReference && (
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-xs">{order.paystackReference}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
