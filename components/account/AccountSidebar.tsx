"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, Heart, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase/client";
import type { SessionUser } from "@/lib/auth/session";

const links = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export function AccountSidebar({ user }: { user: SessionUser }) {
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
    <aside className="flex flex-col gap-1">
      <div className="mb-4 border-b border-border pb-4">
        <p className="text-sm font-medium text-foreground">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>

      {links.map((link) => {
        const active = pathname === link.href;
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

      <button
        onClick={handleLogout}
        className="mt-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        <LogOut className="size-4" />
        Logout
      </button>
    </aside>
  );
}
