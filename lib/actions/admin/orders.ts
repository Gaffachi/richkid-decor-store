"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminUser } from "@/lib/auth/admin";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<ActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { ok: false, error: "You must be an admin to do this." };

  if (!ORDER_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid order status." };
  }

  await getAdminDb()
    .collection("orders")
    .doc(orderId)
    .update({ status, updatedAt: FieldValue.serverTimestamp() });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}
