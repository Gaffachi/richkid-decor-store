import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

export function CartSummary({ subtotal }: { subtotal: number }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Delivery</span>
        <span className="font-medium text-foreground">Paid at pickup</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Delivery/parcel fees are paid in cash when you collect your order at the parcel
        office or station — not included in this total.
      </p>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="font-heading text-base text-foreground">Total</span>
        <span className="font-heading text-lg text-foreground">{formatPrice(subtotal)}</span>
      </div>
    </div>
  );
}
