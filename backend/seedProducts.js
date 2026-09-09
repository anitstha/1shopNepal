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
  // Electronics
  {
    name: 'Wireless Noise-Cancelling Headphones',
    categorySlug: 'electronics',
    brand: 'SonyTech',
    price: 18900,
    sale: 1,
    stock: 24,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'],
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life and rich bass sound.',
    rating: 4.7,
  },
  {
    name: 'Smartphone 128GB Midnight Black',
    categorySlug: 'electronics',
    brand: 'NovaMob',
    price: 45999,
    sale: 15,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80'],
    description: '6.5 inch AMOLED display smartphone with 128GB storage, 50MP triple camera and fast charging.',
    rating: 4.5,
  },
  {
    name: 'Ultrabook 14-inch Laptop',
    categorySlug: 'electronics',
    brand: 'NovaBook',
    price: 125000,
    sale: 0,
    stock: 8,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80'],
    description: 'Lightweight 14-inch ultrabook with 16GB RAM, 512GB SSD and 10-hour battery life for professionals.',
    rating: 4.8,
  },
  {
    name: 'Smart Watch Series',
    categorySlug: 'electronics',
    brand: 'NovaFit',
    price: 24999,
    sale: 12,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
    description: 'Water-resistant smartwatch with heart-rate monitor, GPS tracking and 7-day battery life.',
    rating: 4.4,
  },
  {
    name: 'Portable Bluetooth Speaker',
    categorySlug: 'electronics',
    brand: 'SoundMax',
    price: 4500,
    sale: 0,
    stock: 55,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'],
    description: 'Compact portable bluetooth speaker with 360-degree sound and 12-hour playtime.',
    rating: 4.3,
  },
  // Fashion
  {
    name: 'Classic Denim Jacket',
    categorySlug: 'fashion',
    brand: 'UrbanWear',
    price: 3200,
    sale: 20,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1551029506-0807df4e2031?w=600&q=80'],
    description: 'Timeless blue denim jacket in a relaxed fit, made from durable cotton denim.',
    rating: 4.5,
  },
  {
    name: 'Men Casual Formal Shirt',
    categorySlug: 'fashion',
    brand: 'UrbanWear',
    price: 1850,
    sale: 0,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80'],
    description: 'Breathable cotton casual formal shirt, perfect for office and everyday wear.',
    rating: 4.2,
  },
  {
    name: 'Women Summer Floral Dress',
    categorySlug: 'fashion',
    brand: 'BloomStyle',
    price: 2400,
    sale: 10,
    stock: 42,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80'],
    description: 'Light floral summer dress with a flattering A-line cut, ideal for warm days.',
    rating: 4.6,
  },
  {
    name: 'Running Sneakers',
    categorySlug: 'fashion',
    brand: 'Velocity',
    price: 5600,
    sale: 0,
    stock: 28,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
    description: 'Lightweight cushioned running sneakers designed for comfort and performance.',
    rating: 4.4,
  },
  // Groceries
  {
    name: 'Premium Arabica Coffee Beans 1kg',
    categorySlug: 'groceries',
    brand: 'BrewHouse',
    price: 1200,
    sale: 8,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80'],
    description: 'Freshly roasted premium Arabica coffee beans with a rich, smooth flavour.',
    rating: 4.7,
  },
  {
    name: 'Organic Honey Jar 500g',
    categorySlug: 'groceries',
    brand: 'NatureBasket',
    price: 650,
    sale: 0,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80'],
    description: '100% pure organic honey, unprocessed and full of natural goodness.',
    rating: 4.6,
  },
  {
    name: 'Extra Virgin Olive Oil 750ml',
    categorySlug: 'groceries',
    brand: 'Mediterra',
    price: 1400,
    sale: 5,
    stock: 38,
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80'],
    description: 'Cold-pressed extra virgin olive oil, rich in antioxidants and flavour.',
    rating: 4.5,
  },
  {
    name: 'Green Tea Bags 100 Pack',
    categorySlug: 'groceries',
    brand: 'Leafly',
    price: 450,
    sale: 0,
    stock: 120,
    images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80'],
    description: 'High-quality green tea bags, lightly steamed for a fresh, delicate taste.',
    rating: 4.3,
  },
  // Beauty
  {
    name: 'Vitamin C Face Serum 30ml',
    categorySlug: 'beauty',
    brand: 'GlowLab',
    price: 1500,
    sale: 25,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80'],
    description: 'Brightening Vitamin C serum that evens skin tone and boosts radiance.',
    rating: 4.6,
  },
  {
    name: 'Hydrating Face Cream 50ml',
    categorySlug: 'beauty',
    brand: 'GlowLab',
    price: 1100,
    sale: 0,
    stock: 65,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80'],
    description: 'Deeply hydrating face cream with hyaluronic acid for all-day moisture.',
    rating: 4.4,
  },
  {
    name: 'Matte Liquid Lipstick',
    categorySlug: 'beauty',
    brand: 'VelvetKiss',
    price: 750,
    sale: 15,
    stock: 70,
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80'],
    description: 'Long-lasting matte liquid lipstick in a range of bold shades.',
    rating: 4.2,
  },
  {
    name: 'Sunscreen SPF 50+ 60ml',
    categorySlug: 'beauty',
    brand: 'GlowLab',
    price: 950,
    sale: 10,
    stock: 48,
    images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600&q=80'],
    description: 'Broad-spectrum SPF 50+ sunscreen with a lightweight, non-greasy finish.',
    rating: 4.5,
  },
  // Home & Living
  {
    name: 'Cotton Bedding Set King',
    categorySlug: 'home-living',
    brand: 'HomeCraft',
    price: 6800,
    sale: 30,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80'],
    description: 'Soft 100% cotton king-size bedding set with a breathable weave.',
    rating: 4.7,
  },
  {
    name: 'Aroma Diffuser with Essential Oils',
    categorySlug: 'home-living',
    brand: 'ZenHome',
    price: 2200,
    sale: 0,
    stock: 32,
    images: ['https://images.unsplash.com/photo-1602928321674-4e568c644c81?w=600&q=80'],
    description: 'Ultrasonic aroma diffuser with soft LED light and a set of essential oils.',
    rating: 4.5,
  },
  {
    name: 'Ceramic Coffee Mug Set of 4',
    categorySlug: 'home-living',
    brand: 'HomeCraft',
    price: 1600,
    sale: 12,
    stock: 44,
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80'],
    description: 'Set of four ceramic coffee mugs, dishwasher and microwave safe.',
    rating: 4.4,
  },
  {
    name: 'Modern Table Lamp',
    categorySlug: 'home-living',
    brand: 'ZenHome',
    price: 2800,
    sale: 0,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80'],
    description: 'Sleek modern LED table lamp with touch dimming and warm light.',
    rating: 4.3,
  },
  // Accessories
  {
    name: 'Classic Leather Watch',
    categorySlug: 'accessories',
    brand: 'Timeline',
    price: 5400,
    sale: 20,
    stock: 26,
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80'],
    description: 'Elegant classic leather-strap watch with a minimalist dial.',
    rating: 4.6,
  },
  {
    name: 'Minimalist Leather Backpack',
    categorySlug: 'accessories',
    brand: 'UrbanCarry',
    price: 4200,
    sale: 0,
    stock: 29,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'],
    description: 'Minimalist full-grain leather backpack for work and travel with laptop sleeve.',
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
    inserted.forEach((p) =>
      console.log(`  - ${p.name} (${p.slug}) [${p.categorySlug}]`)
    )

    process.exit(0)
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`)
    process.exit(1)
  }
}

seed()
