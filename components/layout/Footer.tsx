import Link from "next/link";
import { MessageCircle, MapPin, Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

/** lucide-react dropped brand/logo glyphs, so social marks are small inline SVGs. */
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v7h3v-7h2.2l.8-3H14v-1.5c0-.5.3-1 1-1h2V8Z" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5c.3 0 .6 0 .9.1" />
      <path d="M14 4c.4 2.2 2.1 3.9 4.3 4.2" />
    </svg>
  );
}

function SnapchatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3c-3 0-5 2.3-5 5.5v2c-1 .3-2 1-2.5 1.8-.3.5 0 1 .5 1.1l1.6.4c.1.7.4 1.3.8 1.8-.2.5-.6.9-1.1 1.2-.5.3-.3 1 .3 1.1 1 .2 1.7.5 2.1.9.5.6 1.7 1.2 3.3 1.2s2.8-.6 3.3-1.2c.4-.4 1.1-.7 2.1-.9.6-.1.8-.8.3-1.1-.5-.3-.9-.7-1.1-1.2.4-.5.7-1.1.8-1.8l1.6-.4c.5-.1.8-.6.5-1.1-.5-.8-1.5-1.5-2.5-1.8v-2C17 5.3 15 3 12 3Z" />
    </svg>
  );
}

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const shopLinks = [
  { href: "/shop", label: "All Products" },
  { href: "/categories/living-room", label: "Living Room" },
  { href: "/categories/bedroom", label: "Bedroom" },
  { href: "/categories/lighting", label: "Lighting" },
  { href: "/categories/phone-accessories", label: "Phone Accessories" },
];

const helpLinks = [
  { href: "/about", label: "About RDS" },
  { href: "/contact", label: "Contact Us" },
  { href: "/account/orders", label: "Track My Order" },
  { href: "/wishlist", label: "Wishlist" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-heading text-2xl text-foreground">
              RichKid<span className="text-primary">Decor</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Beautiful, affordable home décor for Ghanaian spaces — plus a curated edit
              of everyday phone accessories.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="RichKid Decor Store on Instagram"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <InstagramIcon className="size-5" />
              </a>
              <a
                href="#"
                aria-label="RichKid Decor Store on Facebook"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <FacebookIcon className="size-5" />
              </a>
              <a
                href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with RichKid Decor Store on WhatsApp"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <MessageCircle className="size-5" />
              </a>
              <a
                href="https://www.tiktok.com/@richkid_decor_store"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RichKid Decor Store on TikTok"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <TikTokIcon className="size-5" />
              </a>
              <a
                href="https://www.snapchat.com/add/richkid_rk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RichKid Decor Store on Snapchat"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <SnapchatIcon className="size-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-medium text-foreground">Shop</h3>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-medium text-foreground">Help</h3>
            <ul className="mt-4 space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-medium text-foreground">Get in Touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>Kumasi, Ghana</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0" />
                <a href="tel:+233545446153" className="transition-colors hover:text-foreground">
                  +233 54 544 6153
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0" />
                <a
                  href="mailto:wobilljoseph9@gmail.com"
                  className="transition-colors hover:text-foreground"
                >
                  wobilljoseph9@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RichKid Decor Store. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Beautiful products for beautiful spaces.
          </p>
        </div>
      </div>
    </footer>
  );
}
