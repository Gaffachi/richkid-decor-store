import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import type { Customer } from "@/lib/types";
import { getAllOrders } from "@/lib/data/orders";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  createdAt: string;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const doc = await getAdminDb().collection("users").doc(uid).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    return {
      uid,
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      role: data.role === "admin" ? "admin" : "customer",
      createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
    };
  } catch (error) {
    console.warn("[getUserProfile] Firestore unavailable.", error);
    return null;
  }
}

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const [snap, orders] = await Promise.all([
      getAdminDb().collection("users").orderBy("createdAt", "desc").get(),
      getAllOrders(),
    ]);

    return snap.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        name: data.name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        role: data.role === "admin" ? "admin" : "customer",
        createdAt: data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
        orderCount: orders.filter((o) => o.userId === doc.id).length,
      };
    });
  } catch (error) {
    console.warn("[getAllCustomers] Firestore unavailable — returning empty list.", error);
    return [];
  }
}

export async function createUserProfile(
  uid: string,
  input: { name: string; email: string; phone: string }
): Promise<void> {
  await getAdminDb()
    .collection("users")
    .doc(uid)
    .set({
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: "customer",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
}
