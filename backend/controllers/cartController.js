const Cart = require('../models/Cart')
const Product = require('../models/Product')
const asyncHandler = require('../utils/asyncHandler')

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] })
  }
  return cart
}

const getCartTotal = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  return subtotal
}

const getEffectivePrice = (product) => {
  if (
    product.discountPrice != null &&
    product.discountPrice < product.price
  ) {
    return product.discountPrice
  }
  return product.price
}

const populateCartItems = async (cart) => {
  const populated = await Cart.findOne({ user: cart.user }).populate({
    path: 'items.product',
    select: 'name price discountPrice stock images slug',
  })
  return populated
}

const getCart = asyncHandler(async (req, res) => {
  let cart = await getOrCreateCart(req.user._id)
  cart = await populateCartItems(cart)

  const items = cart.items
    .filter((item) => item.product)
    .map((item) => ({
      _id: item._id,
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        discountPrice: item.product.discountPrice,
        stock: item.product.stock,
        image: item.product.images?.[0] || null,
        slug: item.product.slug,
      },
      quantity: item.quantity,
      price: item.price,
    }))

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  res.json({
    success: true,
    items,
    subtotal,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  })
})

const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body
  const { quantity = 1 } = req.body

  const product = await Product.findById(productId)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const qty = Math.floor(Number(quantity))
  if (!Number.isFinite(qty) || qty < 1) {
    res.status(400)
    throw new Error('Quantity must be at least 1')
  }

  let cart = await getOrCreateCart(req.user._id)

  const existingItem = cart.items.find(
    (item) => item.product.toString() === product._id.toString()
  )

  const currentQty = existingItem ? existingItem.quantity : 0
  const newQty = currentQty + qty

  if (newQty > product.stock) {
    res.status(400)
    throw new Error(
      `Only ${product.stock} item(s) available in stock (requested ${newQty})`
    )
  }

  if (existingItem) {
    existingItem.quantity = newQty
    existingItem.price = getEffectivePrice(product)
  } else {
    cart.items.push({
      product: product._id,
      quantity: newQty,
      price: getEffectivePrice(product),
    })
  }

  await cart.save()
  cart = await populateCartItems(cart)

  res.status(201).json({
    success: true,
    message: 'Product added to cart',
    cart: cart,
  })
})

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const { quantity } = req.body

  const product = await Product.findById(productId)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const cart = await getOrCreateCart(req.user._id)
  const item = cart.items.find(
    (i) => i.product.toString() === productId
  )

  if (!item) {
    res.status(404)
    throw new Error('Item is not in the cart')
  }

  const qty = Math.floor(Number(quantity))
  if (!Number.isFinite(qty) || qty < 1) {
    res.status(400)
    throw new Error('Quantity must be at least 1')
  }

  if (qty > product.stock) {
    res.status(400)
    throw new Error(`Only ${product.stock} item(s) available in stock`)
  }

  item.quantity = qty
  item.price = getEffectivePrice(product)

  await cart.save()
  const populated = await populateCartItems(cart)

  res.json({
    success: true,
    message: 'Cart updated',
    cart: populated,
  })
})

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params

  const cart = await getOrCreateCart(req.user._id)
  const before = cart.items.length
  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  )

  if (cart.items.length === before) {
    res.status(404)
    throw new Error('Item is not in the cart')
  }

  await cart.save()
  const populated = await populateCartItems(cart)

  res.json({
    success: true,
    message: 'Item removed from cart',
    cart: populated,
  })
})

const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id)
  cart.items = []
  await cart.save()

  res.json({
    success: true,
    message: 'Cart cleared',
    cart,
  })
})

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
}
