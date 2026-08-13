"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/lib/actions/admin/orders";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  function handleChange(next: string) {
    const nextStatus = next as OrderStatus;
    setValue(nextStatus);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, nextStatus);
      if (!result.ok) {
        toast.error(result.error);
        setValue(status);
        return;
      }
      toast.success(`Order marked as ${nextStatus}.`);
      router.refresh();
    });
  }

  return (
    <Select value={value} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
