import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductActions } from "@/components/products/ProductActions";
import { ProductBadgeList } from "@/components/products/ProductBadges";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { formatPrice, cn } from "@/lib/utils";
import {
  getProductBySlug,
  getRelatedProducts,
  getCompleteTheLookProducts,
} from "@/lib/data/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Prevents "</script>" (or any "<") in product data from breaking out of the JSON-LD script tag. */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
    alternates: { canonical: `/product/${product.slug}` },
  };
}

const attributeLabels: Record<string, string> = {
  dimensions: "Dimensions",
  materials: "Materials",
  color: "Color",
  careInstructions: "Care Instructions",
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, completeTheLook] = await Promise.all([
    getRelatedProducts(product, 4),
    getCompleteTheLookProducts(product, 4),
  ]);

  const onSale = product.salePrice != null && product.salePrice < product.price;
  const attributeEntries = Object.entries(product.attributes ?? {}).filter(([, v]) => v);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "GHS",
      price: onSale ? product.salePrice : product.price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.rating != null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount ?? 0,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {product.categoryName}
          </p>
          <h1 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {product.rating != null && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="size-4 fill-primary text-primary" />
                <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
                <span>({product.reviewCount ?? 0} reviews)</span>
              </div>
            )}
            <ProductBadgeList product={product} className="flex-row gap-1.5" />
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-heading text-3xl text-foreground">
              {formatPrice(onSale ? product.salePrice! : product.price)}
            </span>
            {onSale && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm font-medium text-primary">
                  Save {formatPrice(product.price - product.salePrice!)}
                </span>
              </>
            )}
          </div>

          <p
            className={cn(
              "mt-2 text-sm font-medium",
              product.stock > 0 ? "text-foreground" : "text-destructive"
            )}
          >
            {product.stock > 0
              ? product.stock <= 5
                ? `Only ${product.stock} left in stock`
                : "In stock"
              : "Out of stock"}
          </p>

          <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-7">
            <ProductActions product={product} />
          </div>

          {attributeEntries.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="font-heading text-base text-foreground">Product Details</h2>
              <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                {attributeEntries.map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 border-b border-border/60 py-2 text-sm sm:justify-start sm:gap-2">
                    <dt className="text-muted-foreground">{attributeLabels[key] ?? key}</dt>
                    <dd className="text-right font-medium text-foreground sm:text-left">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      <RelatedProducts title="You May Also Like" products={related} />
      <RelatedProducts title="Complete the Look" products={completeTheLook} />
    </div>
  );
}
