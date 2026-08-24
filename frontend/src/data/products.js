import { unsplash } from "../utils/format";

/**
 * Mock product catalog used to seed the app on first load.
 * Prices are in Nepali Rupees (NPR).
 *
 * After seeding, the catalog lives in localStorage and is managed
 * by CatalogContext (the admin panel can add / edit / delete products).
 */
export const seedProducts = [
  // ------------------------- Electronics -------------------------
  {
    id: 1,
    name: "SoundCore Wireless Headphones",
    brand: "Anker",
    category: "electronics",
    price: 7499,
    oldPrice: 9500,
    rating: 4.6,
    reviews: 214,
    stock: 24,
    badge: "sale",
    description:
      "Over-ear wireless headphones with deep bass, 40-hour battery life and fast USB-C charging. Perfect for music, calls and travel.",
    features: ["40H battery life", "Bluetooth 5.3", "Built-in mic", "Foldable design"],
    images: [
      unsplash("photo-1505740420928-5e560c06d30e"),
      unsplash("photo-1546435770-a3e426bf472b"),
    ],
  },
  {
    id: 2,
    name: "Pulse Smart Watch Pro",
    brand: "Noise",
    category: "electronics",
    price: 4999,
    oldPrice: null,
    rating: 4.4,
    reviews: 168,
    stock: 40,
    badge: "new",
    description:
      "1.85\" AMOLED display smartwatch with heart-rate tracking, SpO2 monitor, 100+ sports modes and 7-day battery life.",
    features: ["AMOLED display", "Heart-rate & SpO2", "IP68 water resistant", "7-day battery"],
    images: [
      unsplash("photo-1523275335684-37898b6baf30"),
      unsplash("photo-1546868871-7041f2a55e12"),
    ],
  },
  {
    id: 3,
    name: "RetroShot DSLR Camera",
    brand: "Canon",
    category: "electronics",
    price: 89990,
    oldPrice: 105000,
    rating: 4.8,
    reviews: 96,
    stock: 6,
    badge: "sale",
    description:
      "Entry-level DSLR with a 24MP sensor, full HD video recording and Wi-Fi transfer. Great starter camera for creators.",
    features: ["24MP APS-C sensor", "Full HD 1080p video", "Wi-Fi & NFC", "18-55mm kit lens"],
    images: [
      unsplash("photo-1516035069371-29a1b244cc32"),
      unsplash("photo-1502920917128-1aa500764cbd"),
    ],
  },
  {
    id: 4,
    name: "AirBook Ultra Laptop 14\"",
    brand: "Apple",
    category: "electronics",
    price: 189900,
    oldPrice: null,
    rating: 4.9,
    reviews: 132,
    stock: 10,
    badge: null,
    description:
      "Feather-light ultrabook with all-day battery, silent fanless cooling and a stunning retina display for work on the go.",
    features: ["14\" Retina display", "18H battery", "16GB RAM / 512GB SSD", "Backlit keyboard"],
    images: [
      unsplash("photo-1496181133206-80ce9b88a853"),
      unsplash("photo-1517336714731-489689fd1ca8"),
    ],
  },
  {
    id: 5,
    name: "TypeMaster Mechanical Keyboard",
    brand: "Logitech",
    category: "electronics",
    price: 6500,
    oldPrice: 7900,
    rating: 4.5,
    reviews: 87,
    stock: 15,
    badge: null,
    description:
      "Hot-swappable mechanical keyboard with tactile blue switches, per-key RGB lighting and a detachable USB-C cable.",
    features: ["Hot-swappable switches", "Per-key RGB", "Detachable cable", "Aluminum frame"],
    images: [
      unsplash("photo-1587829741301-dc798b83add3"),
      unsplash("photo-1541140532154-b024d705b90a"),
    ],
  },

  // --------------------------- Fashion ---------------------------
  {
    id: 6,
    name: "Classic Denim Jacket",
    brand: "Levi's",
    category: "fashion",
    price: 4599,
    oldPrice: 5800,
    rating: 4.7,
    reviews: 143,
    stock: 22,
    badge: "sale",
    description:
      "Timeless denim jacket cut from mid-weight cotton. Pairs with everything — a year-round layering essential.",
    features: ["100% cotton denim", "Button closure", "Chest flap pockets", "Machine washable"],
    images: [
      unsplash("photo-1542272604-787c3835535d"),
      unsplash("photo-1576995853123-5a10305d93c0"),
    ],
  },
  {
    id: 7,
    name: "Everyday Cotton Tee (Pack of 2)",
    brand: "H&M",
    category: "fashion",
    price: 1290,
    oldPrice: null,
    rating: 4.3,
    reviews: 210,
    stock: 60,
    badge: null,
    description:
      "Soft breathable cotton tees with a regular fit. The everyday staple your wardrobe needs, in classic white.",
    features: ["100% combed cotton", "Regular fit", "Pre-shrunk fabric", "Pack of 2"],
    images: [
      unsplash("photo-1521572163474-6864f9cf17ab"),
      unsplash("photo-1576566588028-4147f3842f27"),
    ],
  },
  {
    id: 8,
    name: "Urban Street Sneakers",
    brand: "Nike",
    category: "fashion",
    price: 8990,
    oldPrice: 11000,
    rating: 4.6,
    reviews: 178,
    stock: 18,
    badge: "sale",
    description:
      "Lightweight sneakers with cushioned foam midsole and breathable mesh upper. Built for city streets and casual wear.",
    features: ["Foam cushioning", "Mesh upper", "Rubber outsole", "Lace-up closure"],
    images: [
      unsplash("photo-1549298916-b41d501d3772"),
      unsplash("photo-1560769629-975ec94e6a86"),
    ],
  },
  {
    id: 9,
    name: "Summer Floral Midi Dress",
    brand: "Zara",
    category: "fashion",
    price: 3899,
    oldPrice: null,
    rating: 4.4,
    reviews: 92,
    stock: 25,
    badge: "new",
    description:
      "Flowy midi dress with an all-over floral print, adjustable straps and a flattering A-line silhouette.",
    features: ["Viscose fabric", "Adjustable straps", "A-line fit", "Side pockets"],
    images: [
      unsplash("photo-1595777457583-95e059d581b8"),
      unsplash("photo-1515372039744-b8f02a3ae446"),
    ],
  },
  {
    id: 10,
    name: "Cozy Fleece Hoodie",
    brand: "Uniqlo",
    category: "fashion",
    price: 2790,
    oldPrice: 3400,
    rating: 4.5,
    reviews: 156,
    stock: 35,
    badge: null,
    description:
      "Brushed-fleece hoodie that feels soft inside and out. Relaxed fit with a kangaroo pocket and ribbed cuffs.",
    features: ["Brushed fleece lining", "Kangaroo pocket", "Ribbed cuffs & hem", "Unisex fit"],
    images: [
      unsplash("photo-1556821840-3a63f95609a7"),
      unsplash("photo-1620799140408-edc6dcb6d633"),
    ],
  },

  // ------------------------ Home & Living ------------------------
  {
    id: 11,
    name: "Modern Fabric Sofa (3 Seater)",
    brand: "HomeTown",
    category: "home-living",
    price: 54990,
    oldPrice: 64990,
    rating: 4.5,
    reviews: 64,
    stock: 4,
    badge: "sale",
    description:
      "Three-seater sofa wrapped in soft linen-blend fabric over a solid sheesham frame. Free installation included.",
    features: ["Solid wood frame", "Linen-blend upholstery", "High-density foam", "Free assembly"],
    images: [
      unsplash("photo-1555041469-a586c61ea9bc"),
      unsplash("photo-1493663284031-b7e3aefcae8e"),
    ],
  },
  {
    id: 12,
    name: "Scandinavian Lounge Chair",
    brand: "IKEA",
    category: "home-living",
    price: 18500,
    oldPrice: null,
    rating: 4.6,
    reviews: 48,
    stock: 9,
    badge: "new",
    description:
      "Minimalist accent chair with a curved backrest and solid oak legs. A statement piece for any reading corner.",
    features: ["Solid oak legs", "Curved backrest", "Easy to clean", "Tool-free assembly"],
    images: [
      unsplash("photo-1586023492125-27b2c045efd7"),
      unsplash("photo-1506439773649-6e0eb8cfb237"),
    ],
  },
  {
    id: 13,
    name: "Ceramic Dinner Set (16 pcs)",
    brand: "ClayCraft",
    category: "home-living",
    price: 6890,
    oldPrice: 8500,
    rating: 4.3,
    reviews: 71,
    stock: 14,
    badge: null,
    description:
      "Hand-glazed stoneware dinner set for four. Microwave and dishwasher safe with a rustic matte finish.",
    features: ["Service for 4", "Microwave safe", "Dishwasher safe", "Hand-glazed finish"],
    images: [
      unsplash("photo-1556911220-bff31c812dba"),
      unsplash("photo-1583847268964-b28dc8f51f92"),
    ],
  },
  {
    id: 14,
    name: "Indoor Monstera Plant",
    brand: "GreenNest",
    category: "home-living",
    price: 1599,
    oldPrice: null,
    rating: 4.7,
    reviews: 118,
    stock: 45,
    badge: null,
    description:
      "Live monstera deliciosa in a ceramic pot. Low-maintenance air-purifying plant that thrives indoors.",
    features: ["Air purifying", "Ceramic pot included", "Height: 40-60 cm", "Care guide included"],
    images: [
      unsplash("photo-1416879595882-3373a0480b5b"),
      unsplash("photo-1463320726281-696a485928c7"),
    ],
  },
  {
    id: 15,
    name: "Cozy Bedroom Set (Queen)",
    brand: "SleepWell",
    category: "home-living",
    price: 12990,
    oldPrice: 15400,
    rating: 4.4,
    reviews: 83,
    stock: 11,
    badge: "sale",
    description:
      "Complete bedding set with duvet cover, fitted sheet and two pillowcases in soft, breathable microfiber.",
    features: ["Queen size", "4-piece set", "Wrinkle resistant", "Fade-proof colors"],
    images: [
      unsplash("photo-1522708323590-d24dbb6b0267"),
      unsplash("photo-1505693416388-ac5ce068fe85"),
    ],
  },

  // ------------------------- Accessories -------------------------
  {
    id: 16,
    name: "Minimalist Leather Watch",
    brand: "Fossil",
    category: "accessories",
    price: 12990,
    oldPrice: 15900,
    rating: 4.8,
    reviews: 134,
    stock: 12,
    badge: "sale",
    description:
      "Slim analog watch with genuine leather strap and sapphire-coated glass. Water resistant up to 50m.",
    features: ["Genuine leather strap", "50m water resistance", "2-year warranty", "Interchangeable strap"],
    images: [
      unsplash("photo-1524805444758-089113d48a6d"),
      unsplash("photo-1522312346375-d1a52e2b99b3"),
    ],
  },
  {
    id: 17,
    name: "Canvas Travel Backpack 30L",
    brand: "Wildcraft",
    category: "accessories",
    price: 3490,
    oldPrice: null,
    rating: 4.5,
    reviews: 197,
    stock: 30,
    badge: null,
    description:
      "Water-resistant canvas backpack with padded laptop sleeve and multiple organizer pockets for daily commutes.",
    features: ["Fits 15.6\" laptop", "Water-resistant canvas", "30L capacity", "USB charging port"],
    images: [
      unsplash("photo-1553062407-98eeb64c6a62"),
      unsplash("photo-1547949003-9792a18a2601"),
    ],
  },
  {
    id: 18,
    name: "Polarized Sunglasses UV400",
    brand: "Ray-Ban",
    category: "accessories",
    price: 5690,
    oldPrice: 7200,
    rating: 4.6,
    reviews: 109,
    stock: 20,
    badge: "sale",
    description:
      "Classic wayfarer sunglasses with polarized UV400 lenses that cut glare and protect your eyes in style.",
    features: ["Polarized lenses", "UV400 protection", "Acetate frame", "Hard case included"],
    images: [
      unsplash("photo-1572635196237-14b3f281503f"),
      unsplash("photo-1511499767150-a48a237f0083"),
    ],
  },
  {
    id: 19,
    name: "Leather Bifold Wallet",
    brand: "Hidesign",
    category: "accessories",
    price: 2450,
    oldPrice: null,
    rating: 4.4,
    reviews: 76,
    stock: 33,
    badge: "new",
    description:
      "Hand-stitched bifold wallet in full-grain leather with RFID blocking and eight card slots.",
    features: ["Full-grain leather", "RFID blocking", "8 card slots", "Slim profile"],
    images: [
      unsplash("photo-1627123424574-724758594e93"),
      unsplash("photo-1591561954557-26941169b49e"),
    ],
  },
  {
    id: 20,
    name: "Classic Baseball Cap",
    brand: "New Era",
    category: "accessories",
    price: 1190,
    oldPrice: 1600,
    rating: 4.2,
    reviews: 88,
    stock: 52,
    badge: null,
    description:
      "Structured six-panel cap with adjustable strap-back closure. One size fits most, in heather grey.",
    features: ["Six-panel build", "Adjustable strap", "Breathable eyelets", "One size fits all"],
    images: [
      unsplash("photo-1521369909029-2afed882baee"),
      unsplash("photo-1588850561407-ed78c282e89b"),
    ],
  },
];

/** Delivery fee charged when the order subtotal is below this amount. */
export const FREE_DELIVERY_THRESHOLD = 5000;
export const DELIVERY_FEE = 100;
