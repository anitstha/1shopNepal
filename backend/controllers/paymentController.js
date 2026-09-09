const crypto = require('crypto')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const asyncHandler = require('../utils/asyncHandler')
const khalti = require('../utils/khalti')

const generateMockPidx = () => `MOCKPIDX-${crypto.randomUUID()}`
const generateMockTxnId = () => `MOCK-TRANSACTION-${crypto.randomUUID()}`

const shortOrderLabel = (order) => `#${order._id.toString().slice(-8).toUpperCase()}`

const buildReturnUrl = (order) =>
  `${process.env.CLIENT_URL}/payment/khalti/callback?orderId=${order._id}`

const loadOwnOrder = async (orderId, user) => {
  const order = await Order.findById(orderId)
  if (!order) {
    const error = new Error('Order not found')
    error.status = 404
    throw error
  }
  if (order.user.toString() !== user._id.toString()) {
    const error = new Error('Not authorized to pay this order')
    error.status = 403
    throw error
  }
  return order
}

const finalizePaidOrder = async (order, txnId, isMock) => {
  const decrements = order.items.map((item) =>
    Product.updateOne(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    )
  )
  const results = await Promise.all(decrements)
  const allOk = results.every((r) => r.matchedCount === 1)

  order.paymentStatus = 'paid'
  order.transactionId = txnId
  order.isMockPayment = Boolean(isMock)

  if (!allOk) {
    const restocks = results
      .map((r, i) =>
        r.matchedCount === 1
          ? Product.updateOne(
              { _id: order.items[i].product },
              { $inc: { stock: order.items[i].quantity } }
            )
          : null
      )
      .filter(Boolean)
    await Promise.all(restocks)

    order.orderStatus = 'pending'
    order.stockDeducted = false
    await order.save()

    const error = new Error(
      'Payment received but some items are no longer in stock. Our support team will contact you.'
    )
    error.status = 409
    throw error
  }

  order.orderStatus = 'confirmed'
  order.stockDeducted = true
  await order.save()

  await Cart.updateOne({ user: order.user }, { $set: { items: [] } })
}

exports.initiateKhaltiPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body

  if (!orderId) {
    res.status(400)
    throw new Error('orderId is required')
  }

  const order = await loadOwnOrder(orderId, req.user)

  if (order.paymentStatus === 'paid') {
    res.status(400)
    throw new Error('Order is already paid')
  }
  if (order.orderStatus === 'cancelled') {
    res.status(400)
    throw new Error('Order is cancelled and cannot be paid')
  }

  const mock = khalti.isMockMode()

  if (!order.pidx) {
    let pidx
    let paymentUrl

    if (mock) {
      pidx = generateMockPidx()
      paymentUrl = `${process.env.CLIENT_URL}/payment/khalti/mock?orderId=${order._id}&pidx=${pidx}`
      order.isMockPayment = true
    } else {
      const initiated = await khalti.initiatePayment({
        return_url: buildReturnUrl(order),
        website_url: process.env.CLIENT_URL,
        amount: khalti.toPaisa(order.totalAmount),
        purchase_order_id: order._id.toString(),
        purchase_order_name: `1ShopNepal Order ${shortOrderLabel(order)}`,
        customer_info: {
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone || undefined,
        },
      })
      pidx = initiated.pidx
      paymentUrl = initiated.payment_url
    }

    order.pidx = pidx
    order.paymentUrl = paymentUrl
    await order.save()
  }

  res.json({
    success: true,
    mode: mock ? 'mock' : 'live',
    isMock: mock,
    orderId: order._id,
    pidx: order.pidx,
    payment_url: order.paymentUrl,
    amount: order.totalAmount,
  })
})

exports.verifyKhaltiPayment = asyncHandler(async (req, res) => {
  const { pidx } = req.body

  if (!pidx) {
    res.status(400)
    throw new Error('pidx is required')
  }

  const order = await Order.findOne({ pidx })
  if (!order) {
    res.status(404)
    throw new Error('Payment session not found')
  }

  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403)
    throw new Error('Not authorized to verify this payment')
  }

  if (order.paymentStatus === 'paid') {
    return res.json({
      success: true,
      alreadyPaid: true,
      message: 'Order is already paid',
      order,
      transactionId: order.transactionId,
      isMock: order.isMockPayment,
    })
  }

  if (order.orderStatus === 'cancelled') {
    res.status(400)
    throw new Error('Order was cancelled before payment completed')
  }

  if (order.isMockPayment && !khalti.isMockMode()) {
    res.status(400)
    throw new Error(
      'This order was paid through the development mock gateway and cannot be verified against live Khalti.'
    )
  }

  let lookup
  if (order.isMockPayment) {
    lookup = {
      status: 'Completed',
      total_amount: khalti.toPaisa(order.totalAmount),
      transaction_id: generateMockTxnId(),
    }
  } else {
    lookup = await khalti.lookupPayment(pidx)
  }

  if (lookup.status !== 'Completed') {
    res.status(400)
    throw new Error(`Payment not completed (Khalti status: ${lookup.status})`)
  }

  if (Number(lookup.total_amount) !== khalti.toPaisa(order.totalAmount)) {
    res.status(400)
    throw new Error('Payment amount does not match the order total. Payment was not applied.')
  }

  await finalizePaidOrder(order, lookup.transaction_id, order.isMockPayment)

  res.json({
    success: true,
    message: 'Payment verified and order confirmed',
    order,
    transactionId: order.transactionId,
    isMock: order.isMockPayment,
  })
})