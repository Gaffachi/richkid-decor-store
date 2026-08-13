import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllCategories } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

export async function FeaturedCollections() {
  const categories = await getAllCategories();
  const primary = categories.filter((c) => !c.isSecondary);
  const secondary = categories.filter((c) => c.isSecondary);

  return (
    <section id="featured-collections" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-10 flex flex-col gap-2 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
          Shop by Collection
        </span>
        <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
          Find your style
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {primary.map((category, i) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className={cn(
              "group relative overflow-hidden rounded-xl bg-secondary",
              i === 0 ? "col-span-2 aspect-[16/9] lg:col-span-2 lg:aspect-square" : "aspect-square"
            )}
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 sm:p-5">
              <h3 className="font-heading text-lg text-white sm:text-xl">{category.name}</h3>
              <ArrowUpRight className="size-5 text-white/90 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {secondary.length > 0 && (
        <div className="mt-5">
          {secondary.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 sm:p-5"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg sm:size-20">
                <Image src={category.image} alt={category.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Secondary Category
                </p>
                <h3 className="font-heading text-lg text-foreground">{category.name}</h3>
              </div>
              <ArrowUpRight className="size-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
