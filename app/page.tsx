import { Hero } from "@/components/home/Hero";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { ShopBySpace } from "@/components/home/ShopBySpace";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <ShopBySpace />
      <FeaturedProducts />
    </>
  );
}
