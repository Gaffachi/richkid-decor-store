"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) {
    return <div className="aspect-square rounded-2xl bg-secondary" />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary">
        <Image
          src={active.url}
          alt={active.altText}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto">
          {images.map((image, i) => (
            <button
              key={image.url + i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show image ${i + 1} of ${productName}`}
              aria-current={i === activeIndex}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:size-20",
                i === activeIndex ? "border-primary" : "border-transparent hover:border-border"
              )}
            >
              <Image src={image.url} alt={image.altText} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
