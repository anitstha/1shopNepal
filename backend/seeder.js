const mongoose = require('mongoose')
const dns = require('dns')
const dotenv = require('dotenv')
const Category = require('./models/Category')

dotenv.config()

if (process.env.DNS_SERVER) {
  dns.setServers(process.env.DNS_SERVER.split(',').map((s) => s.trim()))
}

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Phones, laptops, gadgets and accessories',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, footwear and accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
  },
  {
    name: 'Groceries',
    slug: 'groceries',
    description: 'Daily essentials, food and beverages',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Cosmetics, skincare and personal care',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Home decor, furniture and essentials',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Watches, bags, jewelry and more',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80',
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')

    await Category.deleteMany({})
    console.log('Removed existing categories')

    const inserted = await Category.insertMany(categories)
    console.log(`Seeded ${inserted.length} categories:`)
    inserted.forEach((c) => console.log(`  - ${c.name} (${c.slug})`))

    process.exit(0)
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`)
    process.exit(1)
  }
}

seed()
