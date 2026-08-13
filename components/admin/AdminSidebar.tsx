"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Tags, Users, LogOut, Store } from "lucide-react";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase/client";
import type { SessionUser } from "@/lib/auth/session";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch {
      // Server session cookie clears below regardless of client sign-out result.
    }
    await fetch("/api/auth/session", { method: "DELETE" });
    toast.success("Signed out.");
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="flex h-full flex-col border-r border-border bg-card px-3 py-6">
      <div className="mb-6 px-3">
        <span className="font-heading text-xl text-foreground">
          RichKid<span className="text-primary">Decor</span>
        </span>
        <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 flex flex-col gap-1 border-t border-border pt-4">
        <div className="px-3 pb-2">
          <p className="text-sm font-medium text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
        >
          <Store className="size-4" />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
