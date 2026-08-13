import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon className="size-7" />
      </div>
      <h1 className="mt-6 font-heading text-2xl text-foreground sm:text-3xl">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/shop">Continue Shopping</Link>
      </Button>
    </div>
  );
}
