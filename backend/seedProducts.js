const mongoose = require('mongoose')
const dns = require('dns')
const dotenv = require('dotenv')
const Category = require('./models/Category')
const Product = require('./models/Product')

dotenv.config()

if (process.env.DNS_SERVER) {
  dns.setServers(process.env.DNS_SERVER.split(',').map((s) => s.trim()))
}

const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const products = [
  // ── Electronics (9) ──────────────────────────────────────────────
  {
    name: 'Samsung Galaxy S24 Ultra 256GB',
    categorySlug: 'electronics',
    brand: 'Samsung',
    price: 164999,
    sale: 8,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80',
    ],
    description:
      'Flagship smartphone with 200MP camera, S Pen, titanium frame and Snapdragon 8 Gen 3 processor. 6.8-inch QHD+ Dynamic AMOLED display.',
    rating: 4.8,
  },
  {
    name: 'Apple iPhone 15 Pro Max 256GB',
    categorySlug: 'electronics',
    brand: 'Apple',
    price: 189900,
    sale: 5,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&q=80',
    ],
    description:
      'Apple flagship with A17 Pro chip, titanium design, 48MP camera system, and USB-C. 6.7-inch Super Retina XDR display with ProMotion.',
    rating: 4.9,
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    categorySlug: 'electronics',
    brand: 'Sony',
    price: 39999,
    sale: 15,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
    ],
    description:
      'Industry-leading noise cancellation with Auto NC Optimiser, 30-hour battery, multipoint connection and speak-to-chat feature.',
    rating: 4.7,
  },
  {
    name: 'ASUS ROG Strix G16 Gaming Laptop',
    categorySlug: 'electronics',
    brand: 'ASUS',
    price: 189999,
    sale: 10,
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    ],
    description:
      '16-inch QHD 240Hz display, Intel Core i9-14900HX, NVIDIA RTX 4070, 16GB DDR5 RAM, 1TB SSD. RGB keyboard and ROG Intelligent Cooling.',
    rating: 4.6,
  },
  {
    name: 'Apple MacBook Air M3 13-inch',
    categorySlug: 'electronics',
    brand: 'Apple',
    price: 164999,
    sale: 0,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80',
    ],
    description:
      'Supercharged by M3 chip, 13.6-inch Liquid Retina display, 18-hour battery, 8GB unified memory, 256GB SSD. Fanless design in Midnight.',
    rating: 4.8,
  },
  {
    name: 'JBL Charge 5 Portable Speaker',
    categorySlug: 'electronics',
    brand: 'JBL',
    price: 19999,
    sale: 12,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
    ],
    description:
      'Waterproof portable Bluetooth speaker with JBL Pro Sound, 20-hour playtime, built-in powerbank and IP67 dustproof/waterproof rating.',
    rating: 4.5,
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    categorySlug: 'electronics',
    brand: 'Apple',
    price: 62999,
    sale: 10,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    ],
    description:
      'Always-On Retina display, blood oxygen and ECG sensors, double tap gesture, S9 SiP with 4-core Neural Engine. Carbon neutral option.',
    rating: 4.7,
  },
  {
    name: 'Anker PowerCore 26800mAh Power Bank',
    categorySlug: 'electronics',
    brand: 'Anker',
    price: 6499,
    sale: 0,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&q=80',
    ],
    description:
      'High-capacity 26800mAh portable charger with dual USB ports, PowerIQ technology and fast charging for phones and tablets.',
    rating: 4.4,
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    categorySlug: 'electronics',
    brand: 'Logitech',
    price: 12999,
    sale: 8,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
    ],
    description:
      'Ergonomic wireless mouse with 8K DPI track-on-glass sensor, MagSpeed scroll wheel, USB-C quick charging and multi-device connectivity.',
    rating: 4.6,
  },

  // ── Fashion (7) ─────────────────────────────────────────────────
  {
    name: 'Levi\'s 511 Slim Fit Jeans',
    categorySlug: 'fashion',
    brand: 'Levi\'s',
    price: 6999,
    sale: 20,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
    ],
    description:
      'Classic slim-fit jeans from Levi\'s in dark indigo wash. Comfortable stretch denim with a modern silhouette. Available in multiple sizes.',
    rating: 4.5,
  },
  {
    name: 'Nike Air Max 270 Running Shoes',
    categorySlug: 'fashion',
    brand: 'Nike',
    price: 16999,
    sale: 15,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80',
    ],
    description:
      'Lightweight running shoes with Max Air unit for cushioning, breathable mesh upper and rubber outsole for traction.',
    rating: 4.6,
  },
  {
    name: 'Allen Solly Men Formal Blazer',
    categorySlug: 'fashion',
    brand: 'Allen Solly',
    price: 12999,
    sale: 25,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
      'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&q=80',
    ],
    description:
      'Slim-fit single-breasted blazer in navy blue. Premium polyester-viscose blend, fully lined with two-button closure.',
    rating: 4.4,
  },
  {
    name: 'Zara Women Oversized Cotton T-Shirt',
    categorySlug: 'fashion',
    brand: 'Zara',
    price: 2999,
    sale: 0,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
    ],
    description:
      'Relaxed oversized T-shirt in 100% organic cotton. Heavyweight 220 GSM fabric with dropped shoulders and a boxy fit.',
    rating: 4.3,
  },
  {
    name: 'Puma RS-X Reinvention Sneakers',
    categorySlug: 'fashion',
    brand: 'Puma',
    price: 14999,
    sale: 18,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    ],
    description:
      'Chunky retro-inspired sneakers with RS foam midsole, bold colour-blocked design and rubber outsole for everyday comfort.',
    rating: 4.4,
  },
  {
    name: 'H&M Wool Blend Overcoat',
    categorySlug: 'fashion',
    brand: 'H&M',
    price: 8999,
    sale: 30,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&q=80',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80',
    ],
    description:
      'Double-breasted overcoat in a warm wool-blend fabric. Notched lapels, side pockets and a knee-length cut for winter layering.',
    rating: 4.5,
  },
  {
    name: 'Ray-Ban Aviator Classic Sunglasses',
    categorySlug: 'fashion',
    brand: 'Ray-Ban',
    price: 11999,
    sale: 0,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    ],
    description:
      'Iconic aviator sunglasses with crystal green lenses, gold-tone metal frame and 100% UV protection. Unisex classic style.',
    rating: 4.7,
  },

  // ── Groceries (7) ───────────────────────────────────────────────
  {
    name: 'Himalayan Arabica Coffee Beans 500g',
    categorySlug: 'groceries',
    brand: 'Nepal Coffee Co.',
    price: 850,
    sale: 0,
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
    ],
    description:
      'Single-origin Arabica beans from the hills of Kaski district. Medium roast with notes of chocolate, citrus and a smooth finish.',
    rating: 4.8,
  },
  {
    name: 'Organic Darjeeling First Flush Tea 250g',
    categorySlug: 'groceries',
    brand: 'TeaCraft',
    price: 720,
    sale: 10,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80',
    ],
    description:
      'Premium first flush Darjeeling tea with a light, floral aroma and muscatel flavour. Handpicked and traditionally processed.',
    rating: 4.6,
  },
  {
    name: 'Raw Forest Honey 1kg',
    categorySlug: 'groceries',
    brand: 'HimNature',
    price: 950,
    sale: 0,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=80',
    ],
    description:
      '100% raw, unprocessed forest honey sourced from the Himalayan foothills. Rich in antioxidants with a deep, earthy sweetness.',
    rating: 4.7,
  },
  {
    name: 'Basmati Rice Premium 5kg',
    categorySlug: 'groceries',
    brand: 'Taste of Nepal',
    price: 680,
    sale: 5,
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80',
    ],
    description:
      'Long-grain aged basmati rice with a delicate aroma. Extra-long grains that fluff up perfectly when cooked.',
    rating: 4.4,
  },
  {
    name: 'Extra Virgin Olive Oil 500ml',
    categorySlug: 'groceries',
    brand: 'Mediterra',
    price: 999,
    sale: 12,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80',
      'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=600&q=80',
    ],
    description:
      'Cold-pressed extra virgin olive oil from Mediterranean olives. Rich in polyphenols, ideal for dressing, dipping and cooking.',
    rating: 4.5,
  },
  {
    name: 'Himalayan Pink Salt 1kg',
    categorySlug: 'groceries',
    brand: 'SaltCraft',
    price: 280,
    sale: 0,
    stock: 150,
    images: [
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80',
      'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&q=80',
    ],
    description:
      'Pure Himalayan pink salt hand-mined from ancient sea deposits. Rich in 84 trace minerals, great for cooking and finishing.',
    rating: 4.6,
  },
  {
    name: 'Assorted Nepali Munchies Snack Box',
    categorySlug: 'groceries',
    brand: 'Nepali Bites',
    price: 550,
    sale: 0,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80',
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80',
    ],
    description:
      'A curated box of classic Nepali snacks — sel roti chips, aloo chiura, spicy dalmoth, and salted peanuts. Perfect for sharing.',
    rating: 4.3,
  },

  // ── Beauty (6) ──────────────────────────────────────────────────
  {
    name: 'Mamaearth Vitamin C Face Serum 30ml',
    categorySlug: 'beauty',
    brand: 'Mamaearth',
    price: 599,
    sale: 20,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&q=80',
    ],
    description:
      'Vitamin C and turmeric face serum that brightens skin, reduces dark spots and evens skin tone. Dermatologically tested.',
    rating: 4.5,
  },
  {
    name: 'Neutrogena Hydro Boost Water Gel 50g',
    categorySlug: 'beauty',
    brand: 'Neutrogena',
    price: 1299,
    sale: 10,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
      'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=600&q=80',
    ],
    description:
      'Oil-free moisturiser with hyaluronic acid that delivers 72-hour hydration. Lightweight gel texture absorbs instantly.',
    rating: 4.6,
  },
  {
    name: 'Lakme Absolute Skin Dew Serum Foundation',
    categorySlug: 'beauty',
    brand: 'Lakme',
    price: 899,
    sale: 15,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    ],
    description:
      'Serum-enriched foundation with 24-hour moisture and medium-to-full buildable coverage. Lightweight with a dewy natural finish.',
    rating: 4.3,
  },
  {
    name: 'Maybelline Colossal Kajal 24H',
    categorySlug: 'beauty',
    brand: 'Maybelline',
    price: 349,
    sale: 0,
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80',
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80',
    ],
    description:
      'Smudge-proof, waterproof kajal with intense black colour that lasts up to 24 hours. Ophthalmologist tested and safe for contact lens wearers.',
    rating: 4.4,
  },
  {
    name: 'Biotique Bio Aloe Vera Gel 200ml',
    categorySlug: 'beauty',
    brand: 'Biotique',
    price: 299,
    sale: 0,
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600&q=80',
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80',
    ],
    description:
      'Pure aloe vera gel for face, body and hair. Soothes sunburn, moisturises skin and can be used as a lightweight styling gel.',
    rating: 4.2,
  },
  {
    name: 'Plum Green Tea Clear Face Mask 100g',
    categorySlug: 'beauty',
    brand: 'Plum',
    price: 450,
    sale: 12,
    stock: 38,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
      'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=600&q=80',
    ],
    description:
      'Clay face mask with green tea extract that detoxifies pores, controls excess oil and reduces acne. 100% vegan and paraben-free.',
    rating: 4.3,
  },

  // ── Home & Living (6) ──────────────────────────────────────────
  {
    name: 'Prestige Induction Cooktop 2000W',
    categorySlug: 'home-living',
    brand: 'Prestige',
    price: 3499,
    sale: 15,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
      'https://images.unsplash.com/photo-1585128792020-803d29415281?w=600&q=80',
    ],
    description:
      '2000W Indian induction cooktop with push-button controls, 8预设 menu options, pan detection and timer. ISI certified.',
    rating: 4.4,
  },
  {
    name: 'IKEA KALLAX Shelf Unit 4x2',
    categorySlug: 'home-living',
    brand: 'IKEA',
    price: 8999,
    sale: 0,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80',
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&q=80',
    ],
    description:
      'Versatile 8-cube shelf unit in white. Use vertically or horizontally, add inserts or doors to customise your storage.',
    rating: 4.5,
  },
  {
    name: 'Philips Air Purifier 3000i Series',
    categorySlug: 'home-living',
    brand: 'Philips',
    price: 22999,
    sale: 10,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&q=80',
    ],
    description:
      'HEPA H13 air purifier that removes 99.97% of particles including PM2.5, allergens, viruses and bacteria. Covers up to 79m².',
    rating: 4.6,
  },
  {
    name: 'Bajaj Majesty New_SWX 3 Sandwich Toaster',
    categorySlug: 'home-living',
    brand: 'Bajaj',
    price: 2199,
    sale: 0,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    ],
    description:
      'Dual sandwich toaster with non-stick coated plates, cool-touch handle and auto-thermostat. Makes 2 crispy sandwiches at a time.',
    rating: 4.2,
  },
  {
    name: 'Luminous Zelio 1100VA UPS Inverter',
    categorySlug: 'home-living',
    brand: 'Luminous',
    price: 12499,
    sale: 8,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
      'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&q=80',
    ],
    description:
      'Pure sine wave home UPS inverter with intelligent battery management, LED display and 3-year warranty. Supports up to 1 battery.',
    rating: 4.5,
  },
  {
    name: 'Eureka Forbes Aquaguard RO+UV+UF Water Purifier',
    categorySlug: 'home-living',
    brand: 'Eureka Forbes',
    price: 18999,
    sale: 12,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    ],
    description:
      '7-stage water purifier with RO+UV+UF purification, mineral cartridge, and 6L storage tank. Suitable for TDS up to 2000.',
    rating: 4.6,
  },

  // ── Accessories (6) ─────────────────────────────────────────────
  {
    name: 'Casio G-Shock GA-2100 Analog-Digital Watch',
    categorySlug: 'accessories',
    brand: 'Casio',
    price: 14999,
    sale: 10,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&q=80',
    ],
    description:
      'Carbon core guard G-Shock with octagonal bezel, world time, 5 alarms, stopwatch and 200m water resistance. Military-grade toughness.',
    rating: 4.7,
  },
  {
    name: 'Safari Pentagon Hardside Trolley Bag 55cm',
    categorySlug: 'accessories',
    brand: 'Safari',
    price: 5999,
    sale: 20,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80',
      'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=600&q=80',
    ],
    description:
      'Lightweight polycarbonate trolley bag with 360° spinner wheels, TSA-approved lock, expandable compartment and USB charging port.',
    rating: 4.4,
  },
  {
    name: 'Wildcraft Unisex 33L Rucksack Backpack',
    categorySlug: 'accessories',
    brand: 'Wildcraft',
    price: 3999,
    sale: 0,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
      'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&q=80',
    ],
    description:
      'Durable 33-litre rucksack with padded laptop sleeve, rain cover, multiple compartments and adjustable sternum strap.',
    rating: 4.5,
  },
  {
    name: 'boAt Airdopes 141 True Wireless Earbuds',
    categorySlug: 'accessories',
    brand: 'boAt',
    price: 2499,
    sale: 10,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&q=80',
    ],
    description:
      'Truly wireless earbuds with 42 hours total playback, ENx noise cancellation and a pocketable charging case.',
    rating: 4.3,
  },
  {
    name: 'Fujifilm Instax Mini 12 Instant Camera',
    categorySlug: 'accessories',
    brand: 'Fujifilm',
    price: 7999,
    sale: 12,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80',
    ],
    description:
      'Instant film camera that prints credit-card sized photos in seconds with automatic exposure and a selfie mirror.',
    rating: 4.5,
  },
  {
    name: 'WildStone Titanium Eau de Parfum 60ml',
    categorySlug: 'accessories',
    brand: 'WildStone',
    price: 899,
    sale: 0,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80',
    ],
    description:
      'Long-lasting woody-oriental fragrance with notes of saffron, leather and amber. A bold everyday scent for men.',
    rating: 4.4,
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')

    const categories = await Category.find()
    const bySlug = Object.fromEntries(
      categories.map((c) => [c.slug, c._id.toString()])
    )

    await Product.deleteMany({})
    console.log('Removed existing products')

    const payload = products.map((p) => {
      const discountPrice =
        p.sale > 0 ? Math.round(p.price * (1 - p.sale / 100)) : undefined
      return {
        name: p.name,
        slug: slugify(p.name),
        brand: p.brand,
        price: p.price,
        discountPrice,
        images: p.images,
        category: bySlug[p.categorySlug],
        stock: p.stock,
        description: p.description,
        rating: p.rating,
        reviewCount: Math.floor(Math.random() * 200) + 10,
      }
    })

    const inserted = await Product.insertMany(payload)
    console.log(`Seeded ${inserted.length} products:`)

    const byCategory = {}
    products.forEach((p, i) => {
      byCategory[p.categorySlug] = (byCategory[p.categorySlug] || 0) + 1
    })
    Object.entries(byCategory).forEach(([cat, count]) =>
      console.log(`  ${cat}: ${count}`)
    )
    console.log('')
    inserted.forEach((p) =>
      console.log(`  - ${p.name} (Rs. ${p.price}${p.discountPrice ? ' → Rs. ' + p.discountPrice : ''})`)
    )

    process.exit(0)
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`)
    process.exit(1)
  }
}

seed()
