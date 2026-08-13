"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, User, Heart, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/lib/types";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-sm bg-background p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="font-heading text-xl">
            RichKid<span className="text-primary">Decor</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-3 py-4">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Separator />

        <div className="px-3 py-4">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Shop by category
          </p>
          <div className="flex flex-col">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-secondary"
              >
                {category.name}
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-1 px-3 py-4">
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-secondary"
          >
            <User className="size-4" /> My Account
          </Link>
          <Link
            href="/wishlist"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-secondary"
          >
            <Heart className="size-4" /> Wishlist
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
