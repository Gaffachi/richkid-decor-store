import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle } from "lucide-react";
import { getAllProducts } from "@/lib/data/products";
import { getAllOrders } from "@/lib/data/orders";
import { getAllCustomers } from "@/lib/data/users";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Overview" };

const LOW_STOCK_THRESHOLD = 5;

export default async function AdminOverviewPage() {
  const [products, orders, customers] = await Promise.all([
    getAllProducts(),
    getAllOrders(),
    getAllCustomers(),
  ]);

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalSales = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
  const customerCount = customers.filter((c) => c.role === "customer").length;

  const stats = [
    { label: "Total Sales", value: formatPrice(totalSales), icon: DollarSign },
    { label: "Orders", value: orders.length, icon: ShoppingCart },
    { label: "Customers", value: customerCount, icon: Users },
    { label: "Products", value: products.length, icon: Package },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A snapshot of RichKid Decor Store right now.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {stat.label}
              </p>
              <stat.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 font-heading text-2xl text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="size-4 text-primary" />
          <h2 className="font-heading text-lg text-foreground">Low Stock</h2>
        </div>

        {lowStock.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No products are running low right now.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {lowStock.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}/edit`}
                className="flex items-center justify-between py-2.5 text-sm hover:text-primary"
              >
                <span className="font-medium text-foreground">{product.name}</span>
                <span className="text-muted-foreground">{product.stock} left</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {orders.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
          No orders yet — sales figures will populate here once checkout is live.
        </div>
      )}
    </div>
  );
}
