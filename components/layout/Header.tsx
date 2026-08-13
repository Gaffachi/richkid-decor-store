import Link from "next/link";
import { Heart, ChevronDown } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchBox } from "@/components/layout/SearchBox";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getAllCategories } from "@/lib/data/categories";
import { getCurrentUser } from "@/lib/auth/session";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const [categories, user] = await Promise.all([getAllCategories(), getCurrentUser()]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 lg:hidden">
          <MobileNav categories={categories} />
        </div>

        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Button key={link.href} asChild variant="ghost" className="text-sm font-medium">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 text-sm font-medium">
                Categories <ChevronDown className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {categories.map((category) => (
                <DropdownMenuItem key={category.slug} asChild>
                  <Link href={`/categories/${category.slug}`}>{category.name}</Link>
                </DropdownMenuItem>
              ))}
              {categories.length === 0 && (
                <DropdownMenuItem disabled>No categories yet</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <SearchBox />
          <Button asChild variant="ghost" size="icon" aria-label="Wishlist" className="hidden sm:inline-flex">
            <Link href="/wishlist">
              <Heart className="size-5" />
            </Link>
          </Button>
          <AccountMenu user={user} />
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
