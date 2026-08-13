# RichKid Decor Store (RDS)

A premium e-commerce storefront for RichKid Decor Store — home décor first, phone
accessories second. Built with Next.js (App Router), TypeScript, Tailwind CSS,
shadcn/ui, Framer Motion, Zustand, and Firebase (Firestore, Auth).

**Built so far:** homepage, product catalogue/detail pages (Firestore-backed),
cart (Zustand + localStorage), wishlist (Firestore, per signed-in user), Firebase
Auth (register/login, httpOnly session cookies), a full admin dashboard (products,
categories, orders, customers) with Cloudinary image uploads, and checkout.

**Note on payments:** `project.md` specifies Paystack, but by request this build
uses a **WhatsApp checkout** instead — the customer fills in delivery details,
an Order is saved as `Pending`, and they're handed off to WhatsApp with a
pre-filled order message to confirm price/delivery/payment directly. See
`project.md` for the full original spec and its phased roadmap (§30).

**Note on delivery:** RichKid doesn't charge or collect a delivery fee online —
customers pay the courier/parcel fee in cash when they collect their order at
the parcel office or car station. `Order.deliveryFee` stays in the schema for
historical orders but is always `0` for new ones; checkout total = product
subtotal only, with "Paid at pickup" shown wherever a delivery line item used
to appear.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without a connected Firebase
project the site still builds and runs — product/category sections just render
empty until you complete the setup below.

## Connect Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Firestore** (production mode) and **Authentication** (Email/Password
   provider). Storage is optional — see note below.
3. Project Settings → General → Your apps → add a **Web app** → copy the config
   into `.env.local` (`NEXT_PUBLIC_FIREBASE_*` keys). Copy `.env.local.example`
   to `.env.local` first.
4. Project Settings → Service Accounts → **Generate new private key** → copy
   `project_id`, `client_email` and `private_key` into the `FIREBASE_*` server
   vars in `.env.local`.
5. Seed starter content (categories + realistic RDS products):

   ```bash
   npm run seed
   ```

6. Restart `npm run dev` — the homepage and `/shop` will now show real Firestore
   data.

> **Firebase Storage** requires the Blaze (pay-as-you-go) plan, even for
> free-tier usage. This project uses **Cloudinary** instead (see below) so
> Storage isn't needed unless you want it for something else later.

## Connect Cloudinary (product/category images)

Used by the admin dashboard's image upload widget — no backend or paid plan required.

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Copy your **Cloud name** (shown on the dashboard) into
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in `.env.local`.
3. Settings (gear icon) → **Upload** tab → **Upload presets** → Add upload preset
   → set **Signing Mode** to **Unsigned** → Save. Copy the preset name into
   `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

## Connect WhatsApp checkout

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` to the number orders should be
sent to — international format, digits only, no `+` or spaces (e.g.
`233241234567` for a Ghana number starting `024`). Until this is set, the
WhatsApp button falls back to a generic "choose a contact" link instead of
going straight to the right chat.

## SEO

- `NEXT_PUBLIC_SITE_URL` (in `.env.local`) drives `sitemap.xml`, `robots.txt`,
  canonical tags, and absolute OG image URLs — currently a `localhost`
  placeholder. **Set it to the real production domain before deploying.**
- `app/sitemap.ts` / `app/robots.ts` are generated from live Firestore data
  (all products + categories); `/account`, `/cart`, `/admin` are disallowed.
- `app/opengraph-image.tsx` / `app/twitter-image.tsx` generate a branded
  fallback share image (via `next/og`) for any page without its own —
  product pages already set a per-product image, category pages use the
  category's own image.
- `/shop` and `/categories` set `alternates.canonical` back to their plain
  URL so query-string filters (e.g. `/shop?search=rug`) don't get indexed as
  separate near-duplicate pages.

## Performance

- `lib/data/products.ts` / `lib/data/categories.ts` wrap their Firestore reads
  in `unstable_cache` (60s, tagged `"products"` / `"categories"`) — almost every
  page reads the same catalogue data, so this turns many identical Firestore
  reads into one shared cached read instead of one per request.
- Admin write actions (`lib/actions/admin/products.ts`, `categories.ts`) call
  `updateTag(...)` right after writing, so the cache is invalidated immediately
  — an admin edit is visible on the very next request, not after the 60s window.
- `lib/firebase/client.ts` only initializes Firebase **Auth** client-side (the
  only client SDK actually used anywhere) — Firestore/Storage client SDKs were
  dead weight previously shipped to every page via the header.
- Every image already goes through `next/image` with sized `sizes` props, and
  the header/homepage's own data fetches already run in parallel (`Promise.all`).

**Not changed (documented trade-off):** every route still renders dynamically
(shown as `ƒ` in the build output) rather than statically, because the header
reads the session cookie on every request to show the right account/admin
links. Fully static rendering would need restructuring the header's
personalized bits behind `<Suspense>` boundaries — a bigger, riskier change
than this pass's scope. The `unstable_cache` layer above already removes the
repeated-Firestore-read cost this would otherwise be solving for.

## Admin access

Register an account via `/account/register`, then promote it:

```bash
npm run make-admin -- someone@example.com
```

The account can then sign in and visit `/admin`.

## Project structure

- `app/` — routes (App Router), including `app/admin/*` (admin dashboard) and
  `app/account/(auth)` / `app/account/(dashboard)` (public vs. protected account routes)
- `components/` — feature components grouped by area (`layout`, `home`, `products`,
  `shop`, `cart`, `account`, `admin`, `contact`), plus `components/ui` (shadcn primitives)
- `lib/firebase/client.ts` — browser Firebase SDK
- `lib/firebase/admin.ts` — server-only Firebase Admin SDK (never import from a
  Client Component)
- `lib/data/` — server-only Firestore read queries
- `lib/actions/` — Server Actions for writes (auth, wishlist, checkout, admin CRUD),
  each re-checking authorization server-side; `checkout.ts` re-validates prices/stock
  against Firestore rather than trusting the client cart
- `lib/whatsapp.ts` — builds the pre-filled WhatsApp order message/link, shared by
  checkout and the order confirmation page
- `lib/store/` — Zustand client state (cart, wishlist mirror)
- `lib/auth/session.ts` / `lib/auth/admin.ts` — session cookie verification and
  admin-role gating
- `proxy.ts` — edge-level route protection for `/account/*` and `/admin/*`
  (Next 16's renamed `middleware.ts`)
- `scripts/seed.ts` — Firestore seed script
- `scripts/make-admin.ts` — promotes a registered account to the admin role

## Deploying

Designed for Vercel. Set the same environment variables from `.env.local` in
the Vercel project settings before deploying.
