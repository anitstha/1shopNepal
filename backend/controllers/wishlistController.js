const Wishlist = require('../models/Wishlist')
const Product = require('../models/Product')
const Cart = require('../models/Cart')
const asyncHandler = require('../utils/asyncHandler')

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId })
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] })
  }
  return wishlist
}

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id)

  const products = await Product.find({
    _id: { $in: wishlist.products },
  }).populate('category', 'name slug')

  const ordered = wishlist.products
    .map((id) => products.find((p) => p._id.toString() === id.toString()))
    .filter(Boolean)

  res.json({
    success: true,
    count: ordered.length,
    products: ordered,
  })
})

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body

  if (!productId) {
    res.status(400)
    throw new Error('Product id is required')
  }

  const product = await Product.findById(productId)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const wishlist = await getOrCreateWishlist(req.user._id)

  if (wishlist.products.some((id) => id.toString() === productId.toString())) {
    res.status(409)
    throw new Error('Product is already in the wishlist')
  }

  wishlist.products.push(product._id)
  await wishlist.save()

  const populated = await Product.find({
    _id: { $in: wishlist.products },
  }).populate('category', 'name slug')

  res.status(201).json({
    success: true,
    message: 'Product added to wishlist',
    count: wishlist.products.length,
    products: populated,
  })
})

const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params

  const wishlist = await getOrCreateWishlist(req.user._id)
  const before = wishlist.products.length

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  )

  if (wishlist.products.length === before) {
    res.status(404)
    throw new Error('Product is not in the wishlist')
  }

  await wishlist.save()

  const populated = await Product.find({
    _id: { $in: wishlist.products },
  }).populate('category', 'name slug')

  res.json({
    success: true,
    message: 'Product removed from wishlist',
    count: wishlist.products.length,
    products: populated,
  })
})

const moveToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params

  const product = await Product.findById(productId)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const wishlist = await getOrCreateWishlist(req.user._id)
  if (!wishlist.products.some((id) => id.toString() === productId.toString())) {
    res.status(404)
    throw new Error('Product is not in the wishlist')
  }

  if (product.stock < 1) {
    res.status(400)
    throw new Error('Product is out of stock')
  }

  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] })
  }

  const effectivePrice =
    product.discountPrice != null && product.discountPrice < product.price
      ? product.discountPrice
      : product.price

  const existing = cart.items.find(
    (i) => i.product.toString() === productId.toString()
  )

  if (existing) {
    if (existing.quantity + 1 > product.stock) {
      res.status(400)
      throw new Error(`Only ${product.stock} item(s) available in stock`)
    }
    existing.quantity += 1
    existing.price = effectivePrice
  } else {
    cart.items.push({
      product: product._id,
      quantity: 1,
      price: effectivePrice,
    })
  }

  await cart.save()

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId.toString()
  )
  await wishlist.save()

  res.json({
    success: true,
    message:
      existing && existing.quantity
        ? 'Product moved to cart (added to existing item)'
        : 'Product moved to cart',
    count: wishlist.products.length,
  })
})

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
}