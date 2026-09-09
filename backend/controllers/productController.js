const Product = require('../models/Product')
const Category = require('../models/Category')
const asyncHandler = require('../utils/asyncHandler')
const generateSlug = require('../utils/generateSlug')

const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 100)
  const skip = (page - 1) * limit

  const filter = {}

  if (req.query.search) {
    const search = req.query.search.trim()
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }
  }

  if (req.query.category) {
    const categorySlug = req.query.category.trim().toLowerCase()
    const category = await Category.findOne({ slug: categorySlug })
    if (category) {
      filter.category = category._id
    } else {
      return res.json({
        success: true,
        count: 0,
        total: 0,
        page: 1,
        pages: 1,
        products: [],
      })
    }
  }

  if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
    filter.price = {}
    const min = parseFloat(req.query.minPrice)
    const max = parseFloat(req.query.maxPrice)
    if (!isNaN(min)) filter.price.$gte = min
    if (!isNaN(max)) filter.price.$lte = max
  }

  if (req.query.inStock === 'true') {
    filter.stock = { $gt: 0 }
  }
  if (req.query.inStock === 'false') {
    filter.stock = 0
  }

  const sort = {}
  switch (req.query.sort) {
    case 'price_asc':
      sort.price = 1
      break
    case 'price_desc':
      sort.price = -1
      break
    case 'newest':
      sort.createdAt = -1
      break
    case 'rating':
      sort.rating = -1
      sort.reviewCount = -1
      break
    case 'name':
      sort.name = 1
      break
    default:
      sort.createdAt = -1
  }

  const total = await Product.countDocuments(filter)
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sort)
    .skip(skip)
    .limit(limit)

  res.json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    products,
  })
})

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const isObjectId = /^[a-f\d]{24}$/i.test(id)
  const product = await (isObjectId
    ? Product.findById(id)
    : Product.findOne({ slug: id })
  ).populate('category', 'name slug')

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  res.json({
    success: true,
    product,
  })
})

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    images,
    category,
    brand,
    stock,
    specifications,
  } = req.body

  if (!name || name.trim() === '') {
    res.status(400)
    throw new Error('Product name is required')
  }

  if (price === undefined || isNaN(price) || Number(price) < 0) {
    res.status(400)
    throw new Error('A valid product price is required')
  }

  if (!category) {
    res.status(400)
    throw new Error('Category is required')
  }

  const categoryExists = await Category.findById(category)
  if (!categoryExists) {
    res.status(400)
    throw new Error('Selected category does not exist')
  }

  const slug = generateSlug(name)
  const existing = await Product.findOne({ slug })
  if (existing) {
    res.status(400)
    throw new Error('A product with this name already exists')
  }

  const product = await Product.create({
    name: name.trim(),
    slug,
    description,
    price: Number(price),
    discountPrice:
      discountPrice !== undefined && discountPrice !== null
        ? Number(discountPrice)
        : undefined,
    images:
      Array.isArray(images) && images.length > 0
        ? images
        : ['https://via.placeholder.com/600x600?text=No+Image'],
    category,
    brand,
    stock: stock !== undefined ? Number(stock) : 0,
    specifications,
  })

  const populated = await Product.findById(product._id).populate(
    'category',
    'name slug'
  )

  res.status(201).json({
    success: true,
    product: populated,
  })
})

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const {
    name,
    description,
    price,
    discountPrice,
    images,
    category,
    brand,
    stock,
    specifications,
  } = req.body

  if (name !== undefined) {
    if (!name.trim()) {
      res.status(400)
      throw new Error('Product name cannot be empty')
    }
    const trimName = name.trim()
    const newSlug = generateSlug(trimName)
    const duplicate = await Product.findOne({ slug: newSlug, _id: { $ne: product._id } })
    if (duplicate) {
      res.status(400)
      throw new Error('A product with this name already exists')
    }
    product.name = trimName
    product.slug = newSlug
  }

  if (price !== undefined) {
    if (isNaN(price) || Number(price) < 0) {
      res.status(400)
      throw new Error('A valid product price is required')
    }
    product.price = Number(price)
  }

  if (discountPrice !== undefined && discountPrice !== null) {
    product.discountPrice = Number(discountPrice)
  }

  if (category !== undefined) {
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      res.status(400)
      throw new Error('Selected category does not exist')
    }
    product.category = category
  }

  if (description !== undefined) product.description = description
  if (images !== undefined) product.images = images
  if (brand !== undefined) product.brand = brand
  if (stock !== undefined) product.stock = Number(stock)
  if (specifications !== undefined) product.specifications = specifications

  const updated = await product.save()
  const populated = await Product.findById(updated._id).populate(
    'category',
    'name slug'
  )

  res.json({
    success: true,
    product: populated,
  })
})

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  await product.deleteOne()

  res.json({
    success: true,
    message: 'Product deleted successfully',
  })
})

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
