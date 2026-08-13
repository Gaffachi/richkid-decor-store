"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HERO_SLIDES = [
  {
    src: "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617543/richkid/landing/kq1ocmobb2mgbhywbwoz.jpg",
    alt: "A beautifully styled living room with a wood-base coffee table and cream sofa",
  },
  {
    src: "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786618854/richkid/landing/nsrlr8r8jazkhsh9dxtv.jpg",
    alt: "Bouclé smiley accent rug styled with a book and coffee on a wood floor",
  },
  {
    src: "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617546/richkid/landing/reenx9hinsy9tpjpwsit.jpg",
    alt: "Round nesting coffee tables with marble and wood finishes",
  },
  {
    src: "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617548/richkid/landing/ayxemfpbpcdhsxg0g0l3.jpg",
    alt: "A glowing donut table lamp styled on a bedroom nightstand",
  },
  {
    src: "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617571/richkid/landing/gi4h81bbizgjniyyy2yw.jpg",
    alt: "An entryway styled with a patterned rug and a full-length mirror",
  },
  {
    src: "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617568/richkid/landing/mgitizwablza7bf6ytif.jpg",
    alt: "Three modern accent chairs in black, grey and white",
  },
  {
    src: "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617550/richkid/landing/oulecne5c35lvhx8h3fb.jpg",
    alt: "A framed LEGO Porsche art piece leaning against a tiled wall",
  },
  {
    src: "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617553/richkid/landing/vh6qosledbbfoidz36z7.jpg",
    alt: "Décor figurines styled on a wood table as table décor accents",
  },
  {
    src: "https://res.cloudinary.com/oqk5fdnu/image/upload/v1786617559/richkid/landing/vqihjpptwwbc9yexo8cj.jpg",
    alt: "Two potted faux palm plants against a wood slat wall",
  },
];

const SLIDE_DURATION_MS = 5000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (paused || prefersReducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [paused, prefersReducedMotion]);

  return (
    <section className="relative overflow-hidden bg-secondary/30">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-0 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-2 flex flex-col items-start gap-6 lg:order-1 lg:py-24"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            RichKid Decor Store
          </span>
          <h1 className="font-heading text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            Transform
            <br />
            Your Space.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Stylish, affordable décor pieces that make every room feel more beautiful
            and more you — from statement lighting to the smallest finishing touches.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2 text-base">
              <Link href="/shop">
                Shop Home Décor <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <Link href="#featured-collections">Explore Collections</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-2xl lg:order-2 lg:aspect-auto lg:h-[85vh] lg:rounded-none"
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={HERO_SLIDES[index].src}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <Image
                src={HERO_SLIDES[index].src}
                alt={HERO_SLIDES[index].alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2 sm:bottom-6">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
