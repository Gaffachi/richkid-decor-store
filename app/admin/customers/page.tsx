import type { Metadata } from "next";
import { CustomersTable } from "@/components/admin/CustomersTable";
import { getAllCustomers } from "@/lib/data/users";

export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">{customers.length} registered</p>
      </div>
      <CustomersTable customers={customers} />
    </div>
  );
}
