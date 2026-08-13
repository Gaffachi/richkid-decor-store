import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse every RichKid Decor Store category, from living room décor to phone accessories.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
          Browse
        </span>
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl">All Categories</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl text-white">{category.name}</h2>
                <ArrowUpRight className="size-5 text-white/90 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-white/80">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
