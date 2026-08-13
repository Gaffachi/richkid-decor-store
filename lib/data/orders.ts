import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import type { Order } from "@/lib/types";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

function toOrder(doc: QueryDocumentSnapshot): Order {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId ?? null,
    status: data.status ?? "Pending",
    paymentStatus: data.paymentStatus ?? "pending",
    subtotal: data.subtotal ?? 0,
    deliveryFee: data.deliveryFee ?? 0,
    total: data.total ?? 0,
    shipping: data.shipping ?? {},
    items: data.items ?? [],
    paystackReference: data.paystackReference ?? undefined,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const snap = await getAdminDb().collection("orders").orderBy("createdAt", "desc").get();
    return snap.docs.map(toOrder);
  } catch (error) {
    console.warn("[getAllOrders] Firestore unavailable — returning empty list.", error);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const doc = await getAdminDb().collection("orders").doc(id).get();
    if (!doc.exists) return null;
    return toOrder(doc as QueryDocumentSnapshot);
  } catch (error) {
    console.warn("[getOrderById] Firestore unavailable.", error);
    return null;
  }
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const orders = await getAllOrders();
  return orders.filter((o) => o.userId === userId);
}
