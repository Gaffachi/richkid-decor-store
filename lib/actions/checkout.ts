"use server";

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import type { Order, OrderItem } from "@/lib/types";

type CheckoutResult =
  | { ok: true; orderId: string; whatsappUrl: string }
  | { ok: false; error: string };

export async function createOrder(rawInput: CheckoutInput): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }
  const input = parsed.data;

  const db = getAdminDb();

  // Prices and stock are never trusted from the client — re-fetch each
  // product from Firestore so a tampered cart can't under-price an order.
  const orderItems: OrderItem[] = [];
  for (const cartItem of input.items) {
    const doc = await db.collection("products").doc(cartItem.productId).get();
    if (!doc.exists) {
      return { ok: false, error: "One of the items in your cart is no longer available." };
    }
    const product = doc.data()!;
    if (product.stock < cartItem.quantity) {
      return {
        ok: false,
        error: `Only ${product.stock} of "${product.name}" left in stock — please adjust your cart.`,
      };
    }

    const unitPrice =
      product.salePrice != null && product.salePrice < product.price
        ? product.salePrice
        : product.price;

    orderItems.push({
      productId: doc.id,
      name: product.name,
      image: product.images?.[0]?.url ?? "",
      quantity: cartItem.quantity,
      price: unitPrice,
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Delivery/parcel fees are paid by the customer in cash on pickup (not
  // collected online), so RichKid never calculates or charges one here.
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const user = await getCurrentUser();

  const orderData = {
    userId: user?.uid ?? null,
    status: "Pending" as const,
    paymentStatus: "pending" as const,
    subtotal,
    deliveryFee,
    total,
    shipping: {
      name: input.name,
      email: input.email || undefined,
      phone: input.phone,
      address: input.address,
      city: input.city,
      region: input.region,
      instructions: input.instructions || undefined,
    },
    items: orderItems,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  const ref = await db.collection("orders").add(orderData);

  const now = new Date().toISOString();
  const order: Order = {
    id: ref.id,
    userId: orderData.userId,
    status: orderData.status,
    paymentStatus: orderData.paymentStatus,
    subtotal,
    deliveryFee,
    total,
    shipping: orderData.shipping,
    items: orderItems,
    createdAt: now,
    updatedAt: now,
  };

  return { ok: true, orderId: ref.id, whatsappUrl: buildWhatsappUrl(order) };
}
