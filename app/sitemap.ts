import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/data/products";
import { getAllCategories } from "@/lib/data/categories";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/categories/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: category.createdAt,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/product/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: product.updatedAt,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
