# RichKid Decor Store — Full E-Commerce Website Development Prompt

Build a **modern, premium, production-ready e-commerce website** for a Ghanaian business called **RichKid Decor Store (RDS)**.

The primary business is **home décor**, with a secondary category for **phone accessories**. The website should therefore feel primarily like a stylish interior/home décor brand rather than a generic electronics or marketplace website.

The goal is to create a visually impressive, trustworthy, mobile-first online store where customers can discover products, view detailed product information, add items to a cart, checkout, make payments, and receive order confirmation.

---

## 1. BRAND

**Business name:** RichKid Decor Store

**Short name:** RDS

**Primary business:** Home décor

**Secondary business:** Phone accessories

The visual identity should communicate:

- Premium
- Modern
- Elegant
- Warm
- Stylish
- Aspirational
- Affordable luxury
- Trustworthy

Do NOT make the design look like a generic Shopify/Amazon-style marketplace.

The website should feel closer to a **modern interior-design/lifestyle brand**.

Use the supplied RichKid Decor Store product/reference images as visual inspiration for the brand direction and product presentation.

---

# 2. TECHNOLOGY STACK

Use the following stack:

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide icons
- Framer Motion for tasteful animations

### Backend

Use Next.js server functionality/API routes/server actions where appropriate.

Do NOT create a separate Express backend unless there is a strong architectural reason.

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- Auth.js

Support:

- Customer accounts
- Admin accounts

### Product images

Use Cloudinary or an equivalent optimized image-storage system.

The architecture must support:

- Multiple product images
- Image optimization
- Responsive images
- Product galleries
- Image transformations

### Payments

Design the payment architecture around **Paystack**, with Ghanaian customers in mind.

The system should be structured so payment processing can be securely integrated without exposing secret keys to the client.

### Hosting

The application should be deployable to Vercel.

---

# 3. DESIGN PHILOSOPHY

The most important design principle is:

## "Inspiration → Collection → Product"

Do not design the homepage as simply:

> Product → Product → Product → Product

Home décor is highly visual.

The website should help customers imagine how products could transform their homes.

For example:

### Modern Living Room

Show a visually attractive living-room composition and then allow users to discover products associated with the scene:

- Wall décor
- Decorative pieces
- Artificial plants
- Lighting
- Table décor
- Other accessories

Use large imagery, generous whitespace, elegant typography and carefully controlled animations.

---

# 4. COLOR DIRECTION

Create a sophisticated décor-oriented palette.

Favor:

- Warm neutrals
- Cream
- Beige
- Off-white
- Charcoal
- Soft brown
- Muted earthy tones

Use a restrained accent color derived from the RichKid Decor Store branding.

Avoid:

- Excessive bright colors
- Neon colors
- Overly saturated gradients
- Cheap-looking marketplace styling

The interface should remain clean and premium.

---

# 5. TYPOGRAPHY

Use a modern typography system with strong visual hierarchy.

Use:

- Elegant large headings
- Clean readable body text
- Medium-weight navigation
- Strong product-price typography
- Generous spacing

The typography should feel appropriate for an interior décor/lifestyle brand.

---

# 6. WEBSITE STRUCTURE

Create the following main pages.

## Homepage

The homepage should contain:

### Header

Include:

- RDS logo
- Home
- Shop
- Categories
- About
- Contact
- Search
- Account
- Cart

Make the header responsive.

On mobile, use an elegant mobile navigation menu.

---

## Hero Section

Create a large editorial-style hero section.

The hero should communicate the core brand idea.

Example messaging direction:

**"Transform Your Space."**

Supporting text should communicate that RichKid Decor Store provides stylish décor pieces that make spaces feel more beautiful and personal.

Include a strong CTA:

**Shop Home Décor**

Secondary CTA:

**Explore Collections**

Use a high-quality lifestyle image rather than a plain product cutout.

---

# 7. FEATURED COLLECTIONS

Create visually rich collection cards.

Possible collections:

- Living Room
- Bedroom
- Wall Décor
- Table Décor
- Lighting
- Artificial Plants
- Decorative Accessories
- Phone Accessories

Home décor categories should visually dominate the page.

Phone accessories should be presented as a secondary category.

---

# 8. SHOP BY SPACE

Create an editorial section called:

**Shop by Space**

Possible spaces:

- Living Room
- Bedroom
- Office
- Dining Area
- Entryway

Each section should contain a beautiful visual and a CTA.

Example:

**Living Room**

"Create a space that feels like you."

Button:

**Shop Living Room**

---

# 9. FEATURED PRODUCTS

Create a premium product grid.

Each product card should support:

- Product image
- Product name
- Category
- Price
- Discounted price where applicable
- Wishlist button
- Quick-view button
- Add-to-cart button
- Product badge

Possible badges:

- New
- Best Seller
- Limited
- Sale

Cards should have subtle hover animations.

Do not over-animate the interface.

---

# 10. PRODUCT DISCOVERY

The shop page should provide:

### Search

Customers should be able to search products.

### Filtering

Allow filtering by:

- Category
- Price
- Availability
- New arrivals
- Best sellers
- Sale

### Sorting

Allow:

- Featured
- Newest
- Price: Low to High
- Price: High to Low
- Best Selling

The interface should work beautifully on both desktop and mobile.

---

# 11. PRODUCT PAGE

Create a premium product-detail page.

Layout:

### Left

Large image gallery.

Support:

- Main image
- Thumbnail images
- Zoom
- Multiple product photos

### Right

Show:

- Product name
- Category
- Rating
- Price
- Discount
- Stock status
- Description
- Quantity selector
- Add to Cart
- Buy Now
- Wishlist

Include product information such as:

- Dimensions
- Materials
- Color
- Care instructions
- Availability

Only show attributes that actually exist for the product.

---

# 12. PRODUCT RECOMMENDATIONS

At the bottom of product pages show:

### "You May Also Like"

and:

### "Complete the Look"

Recommendations should be based on category or related products.

For example:

A living-room decorative piece could recommend:

- Wall décor
- Artificial plants
- Table décor
- Lighting

This reinforces the décor-focused shopping experience.

---

# 13. CART

Create a clean shopping cart.

Show:

- Product image
- Product name
- Price
- Quantity
- Subtotal
- Remove button

Show:

- Cart subtotal
- Delivery/shipping information
- Estimated total
- Checkout button

Cart should update dynamically.

---

# 14. CHECKOUT

Create a simple, trustworthy checkout experience.

Collect:

- Customer name
- Email
- Phone number
- Delivery address
- City
- Region
- Additional delivery instructions

Show:

- Order summary
- Products
- Quantity
- Subtotal
- Delivery fee
- Total

Then provide the payment option.

Integrate Paystack securely.

Never expose payment secret keys to the browser.

---

# 15. ORDER CONFIRMATION

After successful checkout show an elegant confirmation page.

Example:

**"Order Confirmed!"**

Display:

- Order number
- Customer name
- Order summary
- Amount paid
- Delivery information
- Expected next steps

Provide a button:

**Continue Shopping**

---

# 16. CUSTOMER ACCOUNT

Customers should be able to create accounts.

Account dashboard:

```text
My Account
├── Profile
├── Orders
├── Order Details
├── Wishlist
└── Logout
```

Customers should be able to see their previous orders.

---

# 17. WISHLIST

Allow customers to save products.

Wishlist should support:

- Add product
- Remove product
- Move product to cart

---

# 18. ADMIN DASHBOARD

Create a separate admin interface.

Dashboard should contain:

### Overview

- Total sales
- Orders
- Customers
- Products
- Low-stock products

### Sales

Display sales trends and useful statistics.

### Products

Admin can:

- Create products
- Edit products
- Delete products
- Upload images
- Change prices
- Set discounts
- Set stock
- Assign categories
- Mark products as featured
- Mark products as best sellers

### Orders

Admin can:

- View orders
- View customer information
- View order items
- View payment status
- Update order status

Order statuses:

```text
Pending
Paid
Processing
Shipped
Delivered
Cancelled
```

### Categories

Admin can manage product categories.

### Customers

Admin can view registered customers and their orders.

---

# 19. DATABASE DESIGN

Use PostgreSQL with Prisma.

Create an appropriate relational schema containing at minimum:

### User

- id
- name
- email
- phone
- password/auth information
- role
- createdAt
- updatedAt

### Product

- id
- name
- slug
- description
- price
- salePrice
- stock
- sku
- categoryId
- featured
- bestSeller
- createdAt
- updatedAt

### ProductImage

- id
- productId
- url
- altText
- sortOrder

### Category

- id
- name
- slug
- description
- image

### Order

- id
- userId
- status
- paymentStatus
- subtotal
- deliveryFee
- total
- shipping information
- createdAt
- updatedAt

### OrderItem

- id
- orderId
- productId
- quantity
- price

### Wishlist

- id
- userId
- productId

Use proper relationships, indexes and constraints.

---

# 20. SECURITY

Treat this as a production application.

Implement:

- Secure authentication
- Password hashing where applicable
- Role-based authorization
- Server-side validation
- Zod validation
- Protected admin routes
- Secure payment processing
- Environment variables for secrets
- Input sanitization
- Database constraints
- Protection against unauthorized product/order manipulation

Customers must never be able to access admin functionality.

---

# 21. RESPONSIVENESS

The website must be fully responsive.

Design specifically for:

- Mobile phones
- Tablets
- Laptops
- Large desktop screens

Mobile is extremely important because many customers will access the store through their phones.

Do not simply shrink the desktop layout.

Create intentional mobile layouts.

---

# 22. PERFORMANCE

Optimize for:

- Fast page loading
- Image optimization
- Lazy loading
- Server-side rendering where appropriate
- Static generation where appropriate
- Minimal unnecessary JavaScript
- Efficient database queries
- Responsive images

Use Next.js image optimization.

---

# 23. SEO

Implement strong e-commerce SEO.

Include:

- Page metadata
- Product metadata
- Open Graph metadata
- SEO-friendly URLs
- Product structured data
- Category pages
- Sitemap
- Robots configuration
- Canonical URLs

Product URLs should look like:

```text
/shop/modern-wall-art
```

rather than:

```text
/product?id=123
```

---

# 24. ANIMATIONS

Use Framer Motion carefully.

Include subtle animations for:

- Page transitions
- Hero entrance
- Product cards
- Image hover
- Cart interactions
- Modal/quick view
- Mobile menu

Animations should feel premium.

Do not make the website feel like a flashy gaming website.

---

# 25. BRAND EXPERIENCE

The website should communicate:

> RichKid Decor Store helps customers create beautiful spaces without making the shopping experience complicated.

The overall experience should feel:

**Elegant + Visual + Simple + Trustworthy + Modern**

---

# 26. CONTENT STRATEGY

Do not fill the website with generic lorem ipsum.

Create realistic placeholder content appropriate for RichKid Decor Store.

However, clearly structure placeholder products so they can easily be replaced with the actual inventory.

The architecture must allow products to come from the database rather than being hardcoded into the UI.

---

# 27. IMAGE STRATEGY

Prioritize product photography and lifestyle photography.

For décor products, use:

1. Lifestyle image
2. Product-only image
3. Detail image
4. Alternative angle

The website should visually demonstrate how décor products look inside real spaces.

Use the supplied reference images to guide the visual direction.

---

# 28. COMPONENT ARCHITECTURE

Create reusable components.

For example:

```text
components/
├── layout/
│   ├── Header
│   ├── Footer
│   └── MobileNav
│
├── products/
│   ├── ProductCard
│   ├── ProductGrid
│   ├── ProductGallery
│   ├── ProductInfo
│   └── RelatedProducts
│
├── cart/
│   ├── CartDrawer
│   ├── CartItem
│   └── CartSummary
│
├── checkout/
│   ├── CheckoutForm
│   └── OrderSummary
│
├── home/
│   ├── Hero
│   ├── FeaturedCollections
│   ├── ShopBySpace
│   └── FeaturedProducts
│
└── ui/
    └── reusable shadcn components
```

Keep components modular and maintainable.

---

# 29. PROJECT STRUCTURE

Use a clean Next.js App Router structure.

Organize routes logically:

```text
app/
├── page.tsx
├── shop/
├── product/
├── categories/
├── cart/
├── checkout/
├── account/
├── wishlist/
├── about/
├── contact/
└── admin/
```

Use appropriate route groups and layouts where beneficial.

---

# 30. DEVELOPMENT APPROACH

Do not attempt to build everything as one giant component.

Build incrementally.

### Phase 1

Create:

- Project foundation
- Global styles
- Brand system
- Navigation
- Homepage
- Product cards
- Product catalogue

### Phase 2

Create:

- Product details
- Search
- Filtering
- Cart
- Wishlist

### Phase 3

Create:

- Authentication
- Checkout
- Paystack
- Orders

### Phase 4

Create:

- Admin dashboard
- Product management
- Order management
- Customer management

### Phase 5

Perform:

- Responsive testing
- Accessibility review
- SEO optimization
- Performance optimization
- Security review
- Production deployment preparation

---

# 31. IMPORTANT IMPLEMENTATION RULES

Do not:

- Hardcode products into components
- Hardcode customer information
- Store payment secrets in frontend code
- Build an unnecessarily complicated backend
- Use excessive animations
- Make the site look like a generic marketplace
- Ignore mobile layouts
- Use random colors unrelated to the brand
- Use placeholder lorem ipsum in the final UI
- Create inaccessible interactive elements

Do:

- Use reusable components
- Use TypeScript properly
- Validate data with Zod
- Keep database operations server-side
- Use environment variables
- Optimize images
- Build mobile-first
- Maintain a premium visual hierarchy
- Make home décor the dominant visual identity
- Keep phone accessories secondary
- Make the code production-ready

---

# 32. FINAL VISUAL DIRECTION

Imagine walking into a beautifully designed home décor showroom.

The website should reproduce that feeling digitally.

Large beautiful imagery.

Warm neutral colors.

Elegant typography.

Smooth transitions.

Clean product cards.

Generous whitespace.

Strong photography.

Simple navigation.

Minimal visual clutter.

The customer should immediately understand:

**RichKid Decor Store = beautiful products for beautiful spaces.**

Build the website around that idea.

Do not merely create an online catalogue.

Create a **complete premium e-commerce experience for RichKid Decor Store.**
