import type { Metadata } from "next";
import { Fraunces, Manrope, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WishlistHydrator } from "@/components/providers/WishlistHydrator";
import { getWishlistProductIds } from "@/lib/actions/wishlist";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RichKid Decor Store | Transform Your Space",
    template: "%s | RichKid Decor Store",
  },
  description:
    "RichKid Decor Store (RDS) is a Ghanaian home décor brand offering stylish living room, bedroom, wall décor, lighting and table décor pieces — plus a curated range of phone accessories.",
  openGraph: {
    type: "website",
    siteName: "RichKid Decor Store",
    title: "RichKid Decor Store | Transform Your Space",
    description:
      "Stylish, affordable home décor and phone accessories for Ghanaian homes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RichKid Decor Store | Transform Your Space",
    description:
      "Stylish, affordable home décor and phone accessories for Ghanaian homes.",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const wishlistIds = await getWishlistProductIds();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <WishlistHydrator ids={wishlistIds} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
