"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/shop?search=${encodeURIComponent(trimmed)}` : "/shop");
    setOpen(false);
  }

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search products"
        onClick={() => setOpen(true)}
        className={className}
      >
        <Search className="size-5" />
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex items-center gap-1", className)}
      role="search"
    >
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => !query && setOpen(false)}
        placeholder="Search décor, lighting, accessories..."
        className="h-9 w-40 sm:w-64"
        aria-label="Search products"
      />
      <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close search">
        <X className="size-4" />
      </Button>
    </form>
  );
}
