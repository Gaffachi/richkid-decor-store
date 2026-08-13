import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Space {
  name: string;
  tagline: string;
  image: string;
  href: string;
}

const spaces: Space[] = [
  {
    name: "Living Room",
    tagline: "Create a space that feels like you.",
    image:
      "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617566/richkid/landing/nanyrzyxy0q9x0dftkss.jpg",
    href: "/shop?category=living-room",
  },
  {
    name: "Bedroom",
    tagline: "Wind down in a room built for rest.",
    image:
      "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617548/richkid/landing/ayxemfpbpcdhsxg0g0l3.jpg",
    href: "/shop?category=bedroom",
  },
  {
    name: "Dining Area",
    tagline: "Set the table for every gathering.",
    image:
      "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617568/richkid/landing/mgitizwablza7bf6ytif.jpg",
    href: "/shop",
  },
  {
    name: "Entryway",
    tagline: "First impressions, beautifully done.",
    image:
      "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617571/richkid/landing/gi4h81bbizgjniyyy2yw.jpg",
    href: "/shop",
  },
];

export function ShopBySpace() {
  return (
    <section className="bg-secondary/30 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Shop by Space
          </span>
          <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
            Every room, reimagined
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {spaces.map((space) => (
            <div
              key={space.name}
              className="group relative aspect-[3/4] w-[70vw] shrink-0 overflow-hidden rounded-xl sm:w-auto"
            >
              <Image
                src={space.image}
                alt={`${space.name} styled with RichKid Decor Store pieces`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 70vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-5">
                <div>
                  <h3 className="font-heading text-xl text-white">{space.name}</h3>
                  <p className="mt-1 text-sm text-white/85">{space.tagline}</p>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="bg-white/95 text-foreground hover:bg-white"
                >
                  <Link href={space.href}>Shop {space.name}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
