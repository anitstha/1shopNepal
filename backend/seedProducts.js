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
  // ── Electronics (8) ─────────────────────────────────────────────
  {
    name: 'Apple iPhone 15 Pro Max 256GB',
    categorySlug: 'electronics',
    brand: 'Apple',
    price: 189900,
    sale: 5,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
    ],
    description:
      'Flagship Apple smartphone with A17 Pro chip, titanium frame, 48MP camera system and USB-C. Super Retina XDR display with ProMotion.',
    rating: 4.9,
  },
  {
    name: 'Samsung Galaxy S24 Ultra 256GB',
    categorySlug: 'electronics',
    brand: 'Samsung',
    price: 164999,
    sale: 8,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
    ],
    description:
      'Galaxy flagship with 200MP camera, built-in S Pen, titanium frame and Snapdragon 8 Gen 3. 6.8-inch QHD+ Dynamic AMOLED display.',
    rating: 4.8,
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro 256GB',
    categorySlug: 'electronics',
    brand: 'Xiaomi',
    price: 34999,
    sale: 10,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
      'https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=600&q=80',
    ],
    description:
      'Popular mid-range smartphone with 200MP main camera, 120Hz AMOLED display and 67W fast charging. Great value for money.',
    rating: 4.5,
  },
  {
    name: 'Apple MacBook Air M1 13-inch',
    categorySlug: 'electronics',
    brand: 'Apple',
    price: 99999,
    sale: 0,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80',
    ],
    description:
      'Fanless MacBook Air powered by the M1 chip. 13.3-inch Retina display, 8GB unified memory and up to 18 hours of battery life.',
    rating: 4.8,
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
      'Industry-leading noise cancelling headphones with 30-hour battery, multipoint connection and crystal clear call quality.',
    rating: 4.7,
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    categorySlug: 'electronics',
    brand: 'Apple',
    price: 34999,
    sale: 10,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600&q=80',
    ],
    description:
      'Wireless earbuds with active noise cancellation, adaptive transparency mode and a USB-C MagSafe charging case.',
    rating: 4.8,
  },
  {
    name: 'JBL Charge 5 Bluetooth Speaker',
    categorySlug: 'electronics',
    brand: 'JBL',
    price: 19999,
    sale: 12,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&q=80',
    ],
    description:
      'Waterproof portable Bluetooth speaker with JBL Pro Sound, 20-hour playtime and a built-in power bank to charge your phone.',
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
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
    ],
    description:
      'Smartwatch with Always-On Retina display, blood oxygen and ECG sensors, double tap gesture and S9 chip.',
    rating: 4.7,
  },

  // ── Fashion (8) ─────────────────────────────────────────────────
  {
    name: 'White Cotton T-Shirt',
    categorySlug: 'fashion',
    brand: 'H&M',
    price: 1299,
    sale: 0,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80',
    ],
    description:
      'Classic crew-neck T-shirt in soft 100% cotton. A wardrobe staple that pairs with anything. Machine washable.',
    rating: 4.3,
  },
  {
    name: 'Grey Pullover Hoodie',
    categorySlug: 'fashion',
    brand: 'H&M',
    price: 2499,
    sale: 10,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    ],
    description:
      'Comfortable fleece pullover hoodie in heather grey with kangaroo pocket and adjustable drawstring hood.',
    rating: 4.4,
  },
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
      'Slim-fit jeans in dark indigo wash with a touch of stretch for all-day comfort. Available in multiple sizes.',
    rating: 4.5,
  },
  {
    name: 'White Sneakers',
    categorySlug: 'fashion',
    brand: 'Puma',
    price: 9999,
    sale: 15,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
    ],
    description:
      'Clean minimalist white sneakers with a cushioned sole. Easy to style for casual and smart looks.',
    rating: 4.4,
  },
  {
    name: 'Nike Running Shoes',
    categorySlug: 'fashion',
    brand: 'Nike',
    price: 15999,
    sale: 15,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
    ],
    description:
      'Lightweight running shoes with responsive cushioning, breathable mesh upper and durable rubber outsole.',
    rating: 4.6,
  },
  {
    name: 'Leather Biker Jacket',
    categorySlug: 'fashion',
    brand: 'Zara',
    price: 12999,
    sale: 20,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
    ],
    description:
      'Classic black leather biker jacket with asymmetric zip, quilted shoulders and a sleek fitted cut.',
    rating: 4.5,
  },
  {
    name: 'Wool Blend Overcoat',
    categorySlug: 'fashion',
    brand: 'H&M',
    price: 8999,
    sale: 30,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&q=80',
    ],
    description:
      'Double-breasted wool-blend overcoat with notched lapels and side pockets. Perfect for winter layering.',
    rating: 4.5,
  },
  {
    name: 'Adjustable Baseball Cap',
    categorySlug: 'fashion',
    brand: 'Nike',
    price: 1999,
    sale: 0,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
    ],
    description:
      'Curved-brim baseball cap with embroidered swoosh, breathable mesh back and adjustable strap closure.',
    rating: 4.2,
  },

  // ── Groceries (6) ───────────────────────────────────────────────
  {
    name: 'Himalayan Arabica Coffee Beans 500g',
    categorySlug: 'groceries',
    brand: 'Nepal Coffee Co.',
    price: 850,
    sale: 0,
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
    ],
    description:
      'Single-origin Arabica beans from the hills of Nepal. Medium roast with notes of chocolate and citrus.',
    rating: 4.8,
  },
  {
    name: 'Organic Darjeeling Tea 250g',
    categorySlug: 'groceries',
    brand: 'TeaCraft',
    price: 720,
    sale: 10,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80',
    ],
    description:
      'Premium first flush Darjeeling loose leaf tea with a light floral aroma and muscatel flavour.',
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
      '100% raw, unprocessed forest honey from the Himalayan foothills. Rich in antioxidants with deep earthy sweetness.',
    rating: 4.7,
  },
  {
    name: 'Basmati Rice Premium 5kg',
    categorySlug: 'groceries',
    brand: 'Taste of Nepal',
    price: 1080,
    sale: 5,
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
    ],
    description:
      'Aged long-grain basmati rice with delicate aroma. Extra-long grains that fluff up perfectly when cooked.',
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
    ],
    description:
      'Cold-pressed extra virgin olive oil rich in polyphenols. Ideal for salads, dipping and everyday cooking.',
    rating: 4.5,
  },
  {
    name: 'Farm Fresh Eggs (12 pack)',
    categorySlug: 'groceries',
    brand: 'Green Valley Farm',
    price: 350,
    sale: 0,
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=600&q=80',
    ],
    description:
      'Fresh free-range eggs from local farms. High protein, rich yolk colour and great for any meal.',
    rating: 4.6,
  },

  // ── Beauty (7) ──────────────────────────────────────────────────
  {
    name: 'WildStone Titanium Eau de Parfum 60ml',
    categorySlug: 'beauty',
    brand: 'WildStone',
    price: 899,
    sale: 0,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80',
    ],
    description:
      'Long-lasting woody fragrance with notes of saffron, leather and amber. A bold everyday scent.',
    rating: 4.4,
  },
  {
    name: 'Matte Liquid Lipstick',
    categorySlug: 'beauty',
    brand: 'Maybelline',
    price: 899,
    sale: 15,
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80',
    ],
    description:
      'Intense colour lipstick with a smooth matte finish that lasts for hours without drying the lips.',
    rating: 4.5,
  },
  {
    name: 'Vitamin C Face Serum 30ml',
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
      'Vitamin C and turmeric face serum that brightens skin, reduces dark spots and evens out skin tone.',
    rating: 4.5,
  },
  {
    name: 'Hydrating Face Gel Moisturizer 50g',
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
      'Oil-free moisturizer with hyaluronic acid for up to 72 hours of hydration. Lightweight gel texture.',
    rating: 4.6,
  },
  {
    name: 'Sun Protection Sunscreen SPF 50',
    categorySlug: 'beauty',
    brand: 'Nivea',
    price: 799,
    sale: 15,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1643379855997-5344bd8d3e78?w=600&q=80',
      'https://images.unsplash.com/photo-1702312685573-bf9c222122f8?w=600&q=80',
    ],
    description:
      'Broad-spectrum sunscreen with SPF 50 that protects against UVA and UVB rays. Water resistant and non-greasy.',
    rating: 4.4,
  },
  {
    name: 'Nourishing Shampoo 500ml',
    categorySlug: 'beauty',
    brand: 'Dove',
    price: 849,
    sale: 10,
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1705155733067-8ace123d7774?w=600&q=80',
    ],
    description:
      'Nutrient-rich shampoo that repairs damaged hair and adds shine. Gentle formula for daily use.',
    rating: 4.3,
  },
  {
    name: 'Glowing Skin Gift Set',
    categorySlug: 'beauty',
    brand: 'Garnier',
    price: 2199,
    sale: 0,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    ],
    description:
      'Complete skincare set with cleanser, toner, serum and moisturizer for a radiant complexion.',
    rating: 4.4,
  },

  // ── Home & Living (6) ──────────────────────────────────────────
  {
    name: 'Electric Kettle 1.7L',
    categorySlug: 'home-living',
    brand: 'Prestige',
    price: 2499,
    sale: 15,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1630617867674-3905ea203152?w=600&q=80',
    ],
    description:
      'Stainless steel electric kettle with rapid boil, auto shut-off and 360° swivel base. 1.7 litre capacity.',
    rating: 4.5,
  },
  {
    name: 'Insulated Steel Water Bottle 1L',
    categorySlug: 'home-living',
    brand: 'Milton',
    price: 1299,
    sale: 0,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
    ],
    description:
      'Double-wall vacuum insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    rating: 4.4,
  },
  {
    name: 'Ceramic Coffee Mug Set (Set of 2)',
    categorySlug: 'home-living',
    brand: 'IKEA',
    price: 1099,
    sale: 0,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80',
    ],
    description:
      'Durable ceramic mugs with comfortable handles. Microwave and dishwasher safe. Perfect for tea and coffee.',
    rating: 4.5,
  },
  {
    name: 'LED Desk Lamp',
    categorySlug: 'home-living',
    brand: 'Philips',
    price: 1999,
    sale: 10,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
    ],
    description:
      'Adjustable LED desk lamp with three brightness levels, touch controls and flexible neck.',
    rating: 4.3,
  },
  {
    name: 'Cotton Double Bedsheet Set',
    categorySlug: 'home-living',
    brand: 'Bombay Dyeing',
    price: 1599,
    sale: 20,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
    ],
    description:
      'Soft breathable cotton bedsheet set with two pillow covers. Fits a double bed and is easy to wash.',
    rating: 4.4,
  },
  {
    name: 'Non-Stick Frying Pan 26cm',
    categorySlug: 'home-living',
    brand: 'Prestige',
    price: 1899,
    sale: 0,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1653806347022-d40d152ca3a4?w=600&q=80',
    ],
    description:
      'Non-stick frying pan with a durable coating, heat-resistant handle and even heat distribution.',
    rating: 4.3,
  },

  // ── Accessories (5) ─────────────────────────────────────────────
  {
    name: 'Men\'s Analog Chronograph Watch',
    categorySlug: 'accessories',
    brand: 'Casio',
    price: 14999,
    sale: 10,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80',
    ],
    description:
      'Classic analog watch with chronograph sub-dials, stainless steel case and leather strap.',
    rating: 4.6,
  },
  {
    name: 'Classic Aviator Sunglasses',
    categorySlug: 'accessories',
    brand: 'Ray-Ban',
    price: 11999,
    sale: 0,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    ],
    description:
      'Iconic aviator sunglasses with metal frame, green tinted lenses and 100% UV protection.',
    rating: 4.7,
  },
  {
    name: 'Genuine Leather Wallet',
    categorySlug: 'accessories',
    brand: 'Hidesign',
    price: 1499,
    sale: 10,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
    ],
    description:
      'Slim bifold wallet made from genuine leather with card slots, note compartment and RFID protection.',
    rating: 4.4,
  },
  {
    name: 'Hardside Trolley Suitcase 55cm',
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
      'Lightweight hardside trolley bag with 360° spinner wheels, TSA lock and expandable compartment.',
    rating: 4.4,
  },
  {
    name: '33L Travel Backpack',
    categorySlug: 'accessories',
    brand: 'Wildcraft',
    price: 3999,
    sale: 0,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80',
    ],
    description:
      'Durable 33-litre backpack with padded laptop sleeve, rain cover and multiple compartments.',
    rating: 4.5,
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