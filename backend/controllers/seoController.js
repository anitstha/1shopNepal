const Product = require('../models/Product')
const Category = require('../models/Category')
const asyncHandler = require('../utils/asyncHandler')

const escapeXml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const siteUrl = () =>
  (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')

const getSitemap = asyncHandler(async (req, res) => {
  const base = siteUrl()

  const staticPaths = [
    { path: '/', priority: '1.0' },
    { path: '/products', priority: '0.9' },
    { path: '/categories', priority: '0.8' },
  ]

  const [categories, products] = await Promise.all([
    Category.find({}).select('slug').lean(),
    Product.find({}).select('slug updatedAt').sort({ updatedAt: -1 }).lean(),
  ])

  const urls = staticPaths.map(
    (s) =>
      `  <url><loc>${base}${escapeXml(s.path)}</loc><priority>${s.priority}</priority></url>`
  )

  categories.forEach((cat) => {
    urls.push(
      `  <url><loc>${base}/categories/${escapeXml(cat.slug)}</loc><priority>0.7</priority></url>`
    )
  })

  const now = new Date().toISOString()
  products.forEach((p) => {
    const lastmod = (p.updatedAt || now).toISOString()
    urls.push(
      `  <url><loc>${base}/products/${escapeXml(p.slug)}</loc><lastmod>${escapeXml(
        lastmod
      )}</lastmod><priority>0.6</priority></url>`
    )
  })

  res.type('application/xml')
  res.send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
      '\n'
    )}\n</urlset>`
  )
})

const getRobots = (req, res) => {
  const base = siteUrl()
  res.type('text/plain')
  res.send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /payment/',
      'Disallow: /checkout',
      'Disallow: /api/',
      '',
      `Sitemap: ${base}/sitemap.xml`,
      '',
    ].join('\n')
  )
}

module.exports = { getSitemap, getRobots }