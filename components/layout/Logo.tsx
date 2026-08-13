import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex flex-col leading-none group", className)}
      aria-label="RichKid Decor Store home"
    >
      <span className="font-heading text-2xl tracking-tight text-foreground">
        RichKid<span className="text-primary">Decor</span>
      </span>
      <span className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
        Store
      </span>
    </Link>
  );
}
