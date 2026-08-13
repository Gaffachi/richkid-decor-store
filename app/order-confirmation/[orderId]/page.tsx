import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { getOrderById } from "@/lib/data/orders";

export const metadata: Metadata = { title: "Order Confirmed" };

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!order) notFound();

  const whatsappUrl = buildWhatsappUrl(order);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="mt-6 font-heading text-3xl text-foreground">Order Received!</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Order <span className="font-medium text-foreground">#{order.id.slice(0, 8).toUpperCase()}</span> has
          been saved. One last step — confirm it with us on WhatsApp so we can arrange payment and delivery.
        </p>

        <Button asChild size="lg" className="mt-6 gap-2">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            Continue on WhatsApp
          </a>
        </Button>
        <Button asChild variant="ghost" className="mt-2">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-heading text-lg text-foreground">Order Summary</h2>
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

        <Separator className="my-4" />

        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Delivering to</p>
          <p className="mt-1">{order.shipping.name}</p>
          <p>{order.shipping.phone}</p>
          <p>
            {order.shipping.address}, {order.shipping.city}, {order.shipping.region}
          </p>
        </div>
      </div>
    </div>
  );
}
