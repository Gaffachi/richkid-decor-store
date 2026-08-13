/**
 * Seeds Firestore with realistic starter content for RichKid Decor Store.
 * Run with: npm run seed
 * Requires .env.local to have the Firebase Admin SDK vars set (see .env.local.example).
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Not importing lib/firebase/admin.ts here: it's guarded by "server-only",
// which throws outside of Next's build context (this script runs under
// plain Node via tsx), so the Admin SDK is initialized directly instead.
function getAdminDb() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Firebase Admin SDK is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local."
      );
    }
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }
  return getFirestore();
}

interface SeedCategory {
  slug: string;
  name: string;
  description: string;
  image: string;
  isSecondary?: boolean;
}

interface SeedProduct {
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  sku: string;
  categorySlug: string;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  images: { seed: string; altText: string }[];
  attributes?: {
    dimensions?: string;
    materials?: string;
    color?: string;
    careInstructions?: string;
  };
  rating?: number;
  reviewCount?: number;
}

const img = (seed: string, w = 1200, h = 1500) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const categories: SeedCategory[] = [
  {
    slug: "living-room",
    name: "Living Room",
    description: "Anchor pieces and accents that turn a living room into a space you never want to leave.",
    image: img("rds-cat-living-room", 1600, 1000),
  },
  {
    slug: "bedroom",
    name: "Bedroom",
    description: "Soft textures and warm layers for a bedroom that feels like a retreat.",
    image: img("rds-cat-bedroom", 1600, 1000),
  },
  {
    slug: "wall-decor",
    name: "Wall Décor",
    description: "Mirrors, prints and hangings that give your walls a story to tell.",
    image: img("rds-cat-wall-decor", 1600, 1000),
  },
  {
    slug: "table-decor",
    name: "Table Décor",
    description: "Vases, trays and candles for coffee tables and console tops.",
    image: img("rds-cat-table-decor", 1600, 1000),
  },
  {
    slug: "lighting",
    name: "Lighting",
    description: "Warm, layered lighting to shape the mood of every room.",
    image: img("rds-cat-lighting", 1600, 1000),
  },
  {
    slug: "artificial-plants",
    name: "Artificial Plants",
    description: "Greenery that stays lush all year, no watering required.",
    image: img("rds-cat-plants", 1600, 1000),
  },
  {
    slug: "decorative-accessories",
    name: "Decorative Accessories",
    description: "The small finishing touches that pull a space together.",
    image: img("rds-cat-accessories", 1600, 1000),
  },
  {
    slug: "phone-accessories",
    name: "Phone Accessories",
    description: "Everyday tech essentials, designed to look as good as they work.",
    image: img("rds-cat-phone", 1600, 1000),
    isSecondary: true,
  },
];

const products: SeedProduct[] = [
  {
    slug: "boucle-smiley-accent-rug",
    name: "Bouclé Smiley Accent Rug",
    description:
      "A plush, round bouclé rug with a hand-tufted smiley motif that brings a playful, layered look to any reading nook or living room corner.",
    price: 180,
    salePrice: 150,
    stock: 24,
    sku: "RDS-RUG-001",
    categorySlug: "living-room",
    featured: true,
    bestSeller: true,
    images: [
      { seed: "rds-rug-smiley-1", altText: "Bouclé smiley accent rug on a wooden floor" },
      { seed: "rds-rug-smiley-2", altText: "Close-up texture of the bouclé smiley rug" },
      { seed: "rds-rug-smiley-3", altText: "Smiley rug styled beside a reading chair" },
    ],
    attributes: {
      dimensions: "90cm diameter",
      materials: "Plush bouclé yarn, non-slip base",
      color: "Sunflower Yellow / Black",
      careInstructions: "Spot clean with mild detergent; air dry flat.",
    },
    rating: 4.8,
    reviewCount: 32,
  },
  {
    slug: "woven-jute-area-rug",
    name: "Woven Jute Area Rug",
    description: "A natural-fibre jute rug with a herringbone weave that grounds a living room in warm, earthy texture.",
    price: 320,
    stock: 14,
    sku: "RDS-RUG-002",
    categorySlug: "living-room",
    images: [
      { seed: "rds-jute-rug-1", altText: "Woven jute area rug in a living room" },
      { seed: "rds-jute-rug-2", altText: "Herringbone weave detail of jute rug" },
    ],
    attributes: {
      dimensions: "160cm x 230cm",
      materials: "100% natural jute",
      color: "Natural Beige",
      careInstructions: "Vacuum regularly; avoid wet cleaning.",
    },
    rating: 4.6,
    reviewCount: 18,
  },
  {
    slug: "charcoal-linen-throw-pillow-set",
    name: "Charcoal Linen Throw Pillow Set",
    description: "A set of two heavyweight linen cushion covers with a relaxed, lived-in drape for sofas and reading chairs.",
    price: 140,
    salePrice: 110,
    stock: 40,
    sku: "RDS-CUS-014",
    categorySlug: "living-room",
    bestSeller: true,
    images: [
      { seed: "rds-linen-cushion-1", altText: "Charcoal linen cushions on a sofa" },
      { seed: "rds-linen-cushion-2", altText: "Linen cushion fabric close-up" },
    ],
    attributes: {
      dimensions: "45cm x 45cm (set of 2)",
      materials: "100% stonewashed linen, feather-blend insert",
      color: "Charcoal",
      careInstructions: "Machine wash cold, tumble dry low.",
    },
    rating: 4.7,
    reviewCount: 21,
  },
  {
    slug: "cloud-cream-duvet-set",
    name: "Cloud Cream Duvet Set",
    description: "A queen-size duvet set in brushed cotton with a subtle ribbed texture for an effortlessly serene bedroom.",
    price: 420,
    stock: 12,
    sku: "RDS-BED-003",
    categorySlug: "bedroom",
    featured: true,
    images: [
      { seed: "rds-duvet-1", altText: "Cream duvet set styled on a bed" },
      { seed: "rds-duvet-2", altText: "Ribbed cotton texture detail of duvet set" },
      { seed: "rds-duvet-3", altText: "Bedroom styled with cream duvet set" },
    ],
    attributes: {
      dimensions: "Queen: 200cm x 230cm duvet cover + 2 pillowcases",
      materials: "100% brushed cotton",
      color: "Cloud Cream",
      careInstructions: "Machine wash warm, tumble dry low.",
    },
    rating: 4.9,
    reviewCount: 27,
  },
  {
    slug: "fringed-cotton-throw-blanket",
    name: "Fringed Cotton Throw Blanket",
    description: "A generously sized cotton throw with a hand-knotted fringe edge, woven in a soft honeycomb texture.",
    price: 190,
    stock: 22,
    sku: "RDS-BED-004",
    categorySlug: "bedroom",
    isNew: true,
    images: [
      { seed: "rds-throw-1", altText: "Fringed cotton throw blanket on a bed" },
      { seed: "rds-throw-2", altText: "Fringe detail of cotton throw blanket" },
    ],
    attributes: {
      dimensions: "130cm x 170cm",
      materials: "100% cotton",
      color: "Oatmeal",
      careInstructions: "Machine wash cold, hang to dry.",
    },
    rating: 4.5,
    reviewCount: 9,
  },
  {
    slug: "woven-rattan-sunburst-mirror",
    name: "Woven Rattan Sunburst Mirror",
    description: "A statement wall mirror framed in hand-woven rattan spokes that catch the light like a soft sunburst.",
    price: 260,
    stock: 16,
    sku: "RDS-WAL-005",
    categorySlug: "wall-decor",
    featured: true,
    bestSeller: true,
    images: [
      { seed: "rds-mirror-1", altText: "Rattan sunburst mirror on a living room wall" },
      { seed: "rds-mirror-2", altText: "Close-up of woven rattan mirror frame" },
      { seed: "rds-mirror-3", altText: "Rattan mirror styled above a console table" },
    ],
    attributes: {
      dimensions: "70cm diameter",
      materials: "Natural rattan, mirrored glass",
      color: "Natural Rattan",
      careInstructions: "Dust with a soft, dry cloth.",
    },
    rating: 4.8,
    reviewCount: 15,
  },
  {
    slug: "abstract-terracotta-canvas-set",
    name: "Abstract Terracotta Canvas Print (Set of 3)",
    description: "A trio of gallery-wrapped abstract canvases in warm terracotta and cream tones, designed to hang as a single composition.",
    price: 340,
    stock: 10,
    sku: "RDS-WAL-006",
    categorySlug: "wall-decor",
    isNew: true,
    images: [
      { seed: "rds-canvas-1", altText: "Terracotta abstract canvas set on a wall" },
      { seed: "rds-canvas-2", altText: "Single canvas from the terracotta print set" },
    ],
    attributes: {
      dimensions: "3 panels, each 40cm x 60cm",
      materials: "Canvas print on wooden frame",
      color: "Terracotta / Cream",
      careInstructions: "Wipe with a dry cloth; avoid direct sunlight.",
    },
    rating: 4.6,
    reviewCount: 11,
  },
  {
    slug: "macrame-wall-hanging",
    name: "Macramé Wall Hanging",
    description: "A hand-knotted cotton macramé hanging with a layered fringe, perfect above a bed or reading nook.",
    price: 175,
    stock: 18,
    sku: "RDS-WAL-007",
    categorySlug: "wall-decor",
    images: [
      { seed: "rds-macrame-1", altText: "Macramé wall hanging above a bed" },
      { seed: "rds-macrame-2", altText: "Knot detail of macramé wall hanging" },
    ],
    attributes: {
      dimensions: "60cm x 90cm",
      materials: "100% cotton cord, wooden dowel",
      color: "Natural White",
      careInstructions: "Spot clean only; avoid pulling fringe.",
    },
    rating: 4.4,
    reviewCount: 7,
  },
  {
    slug: "ceramic-ribbed-vase-trio",
    name: "Ceramic Ribbed Vase Trio",
    description: "Three ribbed ceramic vases in graduated sizes, glazed in warm neutral tones for styling shelves and tables.",
    price: 210,
    salePrice: 175,
    stock: 20,
    sku: "RDS-TAB-008",
    categorySlug: "table-decor",
    featured: true,
    images: [
      { seed: "rds-vase-1", altText: "Ceramic ribbed vase trio on a console table" },
      { seed: "rds-vase-2", altText: "Close-up of ribbed ceramic vase texture" },
    ],
    attributes: {
      dimensions: "Heights: 15cm, 20cm, 26cm",
      materials: "Glazed stoneware ceramic",
      color: "Warm Sand",
      careInstructions: "Wipe clean with a damp cloth.",
    },
    rating: 4.7,
    reviewCount: 19,
  },
  {
    slug: "marble-brass-trinket-tray",
    name: "Marble & Brass Trinket Tray",
    description: "A round marble tray edged in brushed brass, ideal for keys, jewelry or a curated coffee-table vignette.",
    price: 150,
    stock: 26,
    sku: "RDS-TAB-009",
    categorySlug: "table-decor",
    images: [
      { seed: "rds-tray-1", altText: "Marble and brass trinket tray on a table" },
    ],
    attributes: {
      dimensions: "20cm diameter",
      materials: "Natural marble, brass-plated rim",
      color: "White Marble / Brass",
      careInstructions: "Wipe with a soft, dry cloth.",
    },
    rating: 4.5,
    reviewCount: 8,
  },
  {
    slug: "hand-poured-sandalwood-candle",
    name: "Hand-Poured Sandalwood Candle",
    description: "A soy-wax candle hand-poured in a matte ceramic vessel, with a warm sandalwood and amber scent.",
    price: 85,
    stock: 60,
    sku: "RDS-TAB-010",
    categorySlug: "table-decor",
    bestSeller: true,
    images: [
      { seed: "rds-candle-1", altText: "Sandalwood candle in a ceramic vessel" },
      { seed: "rds-candle-2", altText: "Sandalwood candle lit on a side table" },
    ],
    attributes: {
      dimensions: "8cm x 9cm, 45hr burn time",
      materials: "Soy wax blend, cotton wick, ceramic vessel",
      color: "Matte Cream",
      careInstructions: "Trim wick to 5mm before each burn.",
    },
    rating: 4.9,
    reviewCount: 41,
  },
  {
    slug: "sk-bd80a-dual-head-wall-lamp",
    name: "SK-BD80A Dual-Head LED Wall Lamp",
    description: "A modern dual-head wall lamp with adjustable heads and 3-colour temperature switching, perfect for reading corners and hallway accent lighting.",
    price: 220,
    salePrice: 180,
    stock: 35,
    sku: "SK-BD80A",
    categorySlug: "lighting",
    featured: true,
    bestSeller: true,
    images: [
      { seed: "rds-walllamp-1", altText: "SK-BD80A dual-head wall lamp mounted on a wall" },
      { seed: "rds-walllamp-2", altText: "Wall lamp with heads adjusted at an angle" },
      { seed: "rds-walllamp-3", altText: "Wall lamp packaging and box detail" },
    ],
    attributes: {
      dimensions: "18cm x 10cm x 12cm",
      materials: "ABS housing, aluminium reflector",
      color: "Matte Black / Matte White",
      careInstructions: "Wipe with a dry cloth; indoor use only. 1.8W, 3000K/4000K/6500K.",
    },
    rating: 4.6,
    reviewCount: 24,
  },
  {
    slug: "rattan-dome-table-lamp",
    name: "Rattan Dome Table Lamp",
    description: "A woven rattan dome shade over a natural oak base, casting a soft, dappled glow across any room.",
    price: 240,
    stock: 15,
    sku: "RDS-LIT-012",
    categorySlug: "lighting",
    images: [
      { seed: "rds-tablelamp-1", altText: "Rattan dome table lamp lit in a living room" },
      { seed: "rds-tablelamp-2", altText: "Close-up of rattan lamp shade weave" },
    ],
    attributes: {
      dimensions: "35cm height, 30cm shade diameter",
      materials: "Natural rattan, oak base",
      color: "Natural",
      careInstructions: "Dust shade gently; avoid moisture.",
    },
    rating: 4.5,
    reviewCount: 10,
  },
  {
    slug: "warm-glow-rechargeable-table-lamp",
    name: "Warm Glow Rechargeable Table Lamp",
    description: "A cordless, rechargeable LED table lamp with a touch dimmer — perfect for patios, bedside tables or dinner settings.",
    price: 165,
    stock: 30,
    sku: "RDS-LIT-013",
    categorySlug: "lighting",
    isNew: true,
    images: [
      { seed: "rds-recharge-lamp-1", altText: "Warm glow rechargeable table lamp on a nightstand" },
    ],
    attributes: {
      dimensions: "22cm height",
      materials: "Aluminium body, acrylic diffuser",
      color: "Sand Beige",
      careInstructions: "Wipe with a dry cloth; USB-C rechargeable, up to 12hr runtime.",
    },
    rating: 4.7,
    reviewCount: 13,
  },
  {
    slug: "faux-fiddle-leaf-fig-120cm",
    name: "Potted Faux Fiddle Leaf Fig (120cm)",
    description: "A lifelike, full-leafed fiddle leaf fig in a woven planter — an easy way to fill a corner with lush, no-maintenance greenery.",
    price: 380,
    stock: 9,
    sku: "RDS-PLT-015",
    categorySlug: "artificial-plants",
    featured: true,
    images: [
      { seed: "rds-fiddleleaf-1", altText: "Potted faux fiddle leaf fig in a living room corner" },
      { seed: "rds-fiddleleaf-2", altText: "Close-up of faux fiddle leaf fig foliage" },
    ],
    attributes: {
      dimensions: "120cm height",
      materials: "Silk-blend leaves, woven planter",
      color: "Green",
      careInstructions: "Wipe leaves with a damp cloth to remove dust.",
    },
    rating: 4.8,
    reviewCount: 22,
  },
  {
    slug: "faux-eucalyptus-garland",
    name: "Trailing Faux Eucalyptus Garland",
    description: "A soft, trailing eucalyptus garland that drapes beautifully across shelves, mantels or staircase railings.",
    price: 95,
    stock: 45,
    sku: "RDS-PLT-016",
    categorySlug: "artificial-plants",
    images: [
      { seed: "rds-eucalyptus-1", altText: "Faux eucalyptus garland draped on a shelf" },
    ],
    attributes: {
      dimensions: "180cm length",
      materials: "Silk-blend foliage, wire stem",
      color: "Sage Green",
      careInstructions: "Shake gently to remove dust.",
    },
    rating: 4.6,
    reviewCount: 14,
  },
  {
    slug: "handwoven-storage-baskets-set",
    name: "Handwoven Storage Baskets (Set of 2)",
    description: "Two nesting seagrass baskets with sturdy handles, equally at home holding throws, plants or everyday clutter.",
    price: 195,
    stock: 28,
    sku: "RDS-ACC-017",
    categorySlug: "decorative-accessories",
    bestSeller: true,
    images: [
      { seed: "rds-baskets-1", altText: "Handwoven storage baskets styled in a living room" },
      { seed: "rds-baskets-2", altText: "Close-up weave detail of storage baskets" },
    ],
    attributes: {
      dimensions: "Large: 40cm, Small: 32cm diameter",
      materials: "Natural seagrass",
      color: "Natural",
      careInstructions: "Spot clean with a damp cloth; keep dry.",
    },
    rating: 4.7,
    reviewCount: 17,
  },
  {
    slug: "textured-ceramic-bowl-trio",
    name: "Textured Ceramic Bowl Trio",
    description: "Three hand-finished ceramic bowls with a subtle speckled glaze, stackable for styling or everyday use.",
    price: 130,
    stock: 33,
    sku: "RDS-ACC-018",
    categorySlug: "decorative-accessories",
    images: [
      { seed: "rds-bowls-1", altText: "Textured ceramic bowl trio stacked on a shelf" },
    ],
    attributes: {
      dimensions: "Diameters: 12cm, 16cm, 20cm",
      materials: "Glazed stoneware ceramic",
      color: "Speckled Cream",
      careInstructions: "Dishwasher safe on gentle cycle.",
    },
    rating: 4.5,
    reviewCount: 6,
  },
  {
    slug: "braided-usbc-fast-charge-cable",
    name: "Braided USB-C Fast Charge Cable (1.5m)",
    description: "A durable, tangle-resistant braided nylon USB-C cable built for daily fast charging without fraying at the connector.",
    price: 45,
    stock: 120,
    sku: "PA-CBL-015",
    categorySlug: "phone-accessories",
    bestSeller: true,
    images: [
      { seed: "rds-cable-1", altText: "Braided USB-C fast charge cable coiled" },
      { seed: "rds-cable-2", altText: "USB-C cable connector close-up" },
    ],
    attributes: {
      dimensions: "1.5m length",
      materials: "Braided nylon jacket, reinforced connectors",
      color: "Space Grey",
      careInstructions: "Avoid sharp bends near the connector.",
    },
    rating: 4.6,
    reviewCount: 58,
  },
  {
    slug: "magsafe-compatible-slim-case",
    name: "MagSafe-Compatible Slim Phone Case",
    description: "A slim, shock-absorbing case with a magnetic ring for snap-on chargers and mounts — protection without the bulk.",
    price: 70,
    stock: 80,
    sku: "PA-CSE-021",
    categorySlug: "phone-accessories",
    isNew: true,
    images: [
      { seed: "rds-case-1", altText: "Slim magnetic phone case on a smartphone" },
    ],
    attributes: {
      materials: "TPU + polycarbonate, magnetic ring",
      color: "Terracotta",
      careInstructions: "Wipe clean with a soft, dry cloth.",
    },
    rating: 4.4,
    reviewCount: 12,
  },
  {
    slug: "3-in-1-wireless-charging-stand",
    name: "3-in-1 Wireless Charging Stand",
    description: "Charge your phone, earbuds and watch at once on a minimalist stand designed to sit neatly on a nightstand or desk.",
    price: 210,
    salePrice: 175,
    stock: 25,
    sku: "PA-CHG-030",
    categorySlug: "phone-accessories",
    images: [
      { seed: "rds-charge-stand-1", altText: "3-in-1 wireless charging stand with phone and earbuds" },
      { seed: "rds-charge-stand-2", altText: "Charging stand on a bedside table at night" },
    ],
    attributes: {
      dimensions: "18cm x 10cm x 14cm",
      materials: "Aluminium + silicone charging pads",
      color: "Matte Black",
      careInstructions: "Wipe with a dry cloth; keep charging coils dust-free.",
    },
    rating: 4.5,
    reviewCount: 20,
  },
];

async function seed() {
  const db = getAdminDb();
  const categoryMap = new Map(categories.map((c) => [c.slug, c]));

  console.log(`Seeding ${categories.length} categories...`);
  const catBatch = db.batch();
  for (const cat of categories) {
    const ref = db.collection("categories").doc(cat.slug);
    catBatch.set(ref, {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      isSecondary: cat.isSecondary ?? false,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  await catBatch.commit();

  console.log(`Seeding ${products.length} products...`);
  const prodBatch = db.batch();
  for (const p of products) {
    const category = categoryMap.get(p.categorySlug);
    if (!category) throw new Error(`Unknown category slug: ${p.categorySlug}`);

    const ref = db.collection("products").doc(p.slug);
    prodBatch.set(ref, {
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice ?? null,
      stock: p.stock,
      sku: p.sku,
      categoryId: category.slug,
      categorySlug: category.slug,
      categoryName: category.name,
      featured: p.featured ?? false,
      bestSeller: p.bestSeller ?? false,
      isNew: p.isNew ?? false,
      images: p.images.map((image, i) => ({
        url: img(image.seed),
        altText: image.altText,
        sortOrder: i,
      })),
      attributes: p.attributes ?? {},
      rating: p.rating ?? null,
      reviewCount: p.reviewCount ?? 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
  await prodBatch.commit();

  console.log("Seed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
