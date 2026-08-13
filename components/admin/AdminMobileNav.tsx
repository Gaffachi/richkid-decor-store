"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, Package, ShoppingCart, Tags, Users } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open admin menu" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] max-w-xs p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="font-heading text-lg">
            RichKid<span className="text-primary">Decor</span> Admin
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium",
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
