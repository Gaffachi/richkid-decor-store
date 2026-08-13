"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Heart, LogOut, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SessionUser } from "@/lib/auth/session";

export function AccountMenu({ user }: { user: SessionUser | null }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch {
      // Client sign-out failing is non-fatal — the server session cookie is
      // the source of truth and is always cleared below.
    }
    await fetch("/api/auth/session", { method: "DELETE" });
    toast.success("Signed out.");
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <Button asChild variant="ghost" size="icon" aria-label="Sign in">
        <Link href="/account/login">
          <User className="size-5" />
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account menu">
          <User className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <LayoutDashboard className="size-4" /> Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/account" className="cursor-pointer">
            <User className="size-4" /> My Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/orders" className="cursor-pointer">
            <Package className="size-4" /> Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/wishlist" className="cursor-pointer">
            <Heart className="size-4" /> Wishlist
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="size-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
