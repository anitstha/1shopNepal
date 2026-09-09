const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const asyncHandler = require('../utils/asyncHandler')

const SHIPPING_THRESHOLD = 10000
const SHIPPING_COST = 200
const ALLOWED_PAYMENT_METHODS = ['cod', 'khalti']

const getEffectivePrice = (product) => {
  if (product.discountPrice != null && product.discountPrice < product.price) {
    return product.discountPrice
  }
  return product.price
}

const getShippingCost = (subtotal) =>
  subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST

exports.createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body

  if (!shippingAddress) {
    res.status(400)
    throw new Error('Shipping address is required')
  }

  if (paymentMethod && !ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
    res.status(400)
    throw new Error('Invalid payment method')
  }

  const method = paymentMethod || 'cod'

  const cart = await Cart.findOne({ user: req.user._id })
  const cartItems = cart?.items || []

  if (!cartItems.length) {
    res.status(400)
    throw new Error('Your cart is empty. Add items before checking out.')
  }

  const productIds = cartItems.map((i) => i.product)
  const products = await Product.find({ _id: { $in: productIds } })
  const productMap = new Map(products.map((p) => [p._id.toString(), p]))

  const orderItems = []
  for (const item of cartItems) {
    const product = productMap.get(item.product.toString())
    if (!product) {
      res.status(404)
      throw new Error('One or more products in your cart no longer exist')
    }

    const quantity = Math.floor(Number(item.quantity))
    if (!Number.isFinite(quantity) || quantity < 1) {
      res.status(400)
      throw new Error(`Invalid quantity for ${product.name}`)
    }

    if (quantity > product.stock) {
      res.status(400)
      throw new Error(`Only ${product.stock} item(s) of "${product.name}" available in stock`)
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity,
      price: getEffectivePrice(product),
    })
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = getShippingCost(subtotal)
  const totalAmount = subtotal + shippingCost

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    subtotal,
    shippingCost,
    totalAmount,
    paymentMethod: method,
    paymentStatus: 'pending',
    orderStatus: 'pending',
    stockDeducted: method === 'cod',
  })

  if (method === 'cod') {
    await Promise.all(
      orderItems.map((item) =>
        Product.updateOne(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } }
        )
      )
    )

    const cartToClear = await Cart.findOne({ user: req.user._id })
    if (cartToClear) {
      cartToClear.items = []
      await cartToClear.save()
    }
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order,
  })
})

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })

  res.json({
    success: true,
    count: orders.length,
    orders,
  })
})

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403)
    throw new Error('Not authorized to view this order')
  }

  res.json({
    success: true,
    order,
  })
})

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  const { orderStatus, paymentStatus } = req.body

  const validOrderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
  if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
    res.status(400)
    throw new Error('Invalid order status')
  }

  const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded']
  if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
    res.status(400)
    throw new Error('Invalid payment status')
  }

  if (orderStatus) order.orderStatus = orderStatus
  if (paymentStatus) order.paymentStatus = paymentStatus

  if (order.orderStatus === 'cancelled' && order.paymentStatus === 'pending' && order.stockDeducted) {
    await Promise.all(
      order.items.map((item) =>
        Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
      )
    )
    order.stockDeducted = false
  }

  await order.save()

  res.json({
    success: true,
    message: 'Order status updated',
    order,
  })
})