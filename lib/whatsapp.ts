import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";

function shortOrderId(orderId: string) {
  return orderId.slice(0, 8).toUpperCase();
}

export function buildWhatsappMessage(order: Order): string {
  const lines = [
    `Hi RichKid Decor Store! I'd like to place an order (#${shortOrderId(order.id)}):`,
    "",
    ...order.items.map(
      (item) => `• ${item.name} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`
    ),
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Delivery: Paid at pickup (parcel office/station)`,
    `Total: ${formatPrice(order.total)}`,
    "",
    "Delivery Details:",
    `Name: ${order.shipping.name}`,
    `Phone: ${order.shipping.phone}`,
    `Address: ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.region}`,
  ];

  if (order.shipping.instructions) {
    lines.push(`Notes: ${order.shipping.instructions}`);
  }

  return lines.join("\n");
}

/**
 * NEXT_PUBLIC_WHATSAPP_NUMBER must be digits only, international format,
 * no "+" or spaces (e.g. 233241234567 for a Ghana number starting 024).
 */
export function buildWhatsappUrl(order: Order): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent(buildWhatsappMessage(order));
  return number ? `https://wa.me/${number}?text=${message}` : `https://wa.me/?text=${message}`;
}
