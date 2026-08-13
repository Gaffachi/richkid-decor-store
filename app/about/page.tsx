import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "RichKid Decor Store (RDS) is a Ghanaian home décor brand on a mission to make beautiful, well-made interiors accessible to every home.",
};

const values = [
  {
    title: "Beautiful, not complicated",
    body: "We curate pieces that transform a room at a glance, and we keep the shopping experience just as simple.",
  },
  {
    title: "Affordable luxury",
    body: "Premium materials and finishes, priced for real Ghanaian homes — not just showrooms.",
  },
  {
    title: "Built to last",
    body: "Every piece is chosen for quality first, so your space stays beautiful long after checkout.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <Image
          src="https://picsum.photos/seed/rds-about-hero/1600/900"
          alt="A warmly styled home interior featuring RichKid Decor Store pieces"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/80">
            Our Story
          </span>
          <h1 className="mt-2 font-heading text-3xl text-white sm:text-4xl">
            Beautiful products for beautiful spaces
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-lg leading-relaxed text-foreground">
          RichKid Decor Store (RDS) started with a simple belief: your home should feel as
          good as it looks. We&rsquo;re a Ghana-based décor brand bringing together statement
          furniture accents, warm lighting, wall art, textiles and everyday accessories —
          curated so that every piece works together, not just alone.
        </p>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          Home décor is our heart, but we also stock a small, carefully chosen range of
          phone accessories for the everyday essentials that don&rsquo;t need to be an
          afterthought. Whether you&rsquo;re furnishing a first apartment, refreshing a living
          room, or picking up a gift, we want RDS to be the place you come back to for
          things that make a space feel like you.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title}>
              <h2 className="font-heading text-lg text-foreground">{value.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
