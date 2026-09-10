const crypto = require('crypto')
const https = require('https')
const http = require('http')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const asyncHandler = require('../utils/asyncHandler')
const { generateEsewaSignature, generateTransactionUuid } = require('../utils/esewa')

const SHIPPING_THRESHOLD = 10000
const SHIPPING_COST = 0

const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST'
const ESEWA_PAYMENT_URL =
  process.env.ESEWA_PAYMENT_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
const ESEWA_STATUS_URL = 'https://rc.esewa.com.np/api/epay/transaction/status/'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

const getEffectivePrice = (product) => {
  if (product.discountPrice != null && product.discountPrice < product.price) {
    return product.discountPrice
  }
  return product.price
}

const getShippingCost = (subtotal) =>
  subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST

// POST /api/payments/esewa/initiate
exports.initiateEsewaPayment = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body

  if (!shippingAddress) {
    res.status(400)
    throw new Error('Shipping address is required')
  }

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

  const transactionUuid = generateTransactionUuid()

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress: {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      addressLine: shippingAddress.addressLine,
      city: shippingAddress.city,
      district: shippingAddress.district,
      zipCode: shippingAddress.zipCode || '',
    },
    subtotal,
    shippingCost,
    totalAmount,
    paymentMethod: 'esewa',
    paymentStatus: 'pending',
    orderStatus: 'pending',
    stockDeducted: false,
    transactionId: transactionUuid,
  })

  const signature = generateEsewaSignature(totalAmount, transactionUuid, ESEWA_PRODUCT_CODE)

  res.status(201).json({
    success: true,
    orderId: order._id,
    transactionUuid,
    paymentUrl: ESEWA_PAYMENT_URL,
    paymentData: {
      amount: subtotal,
      tax_amount: 0,
      product_service_charge: 0,
      product_delivery_charge: shippingCost,
      product_code: ESEWA_PRODUCT_CODE,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      success_url: `${CLIENT_URL}/payment/esewa/success`,
      failure_url: `${CLIENT_URL}/payment/esewa/failure`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    },
  })
})

// POST /api/payments/esewa/verify
exports.verifyEsewaPayment = asyncHandler(async (req, res) => {
  const { data } = req.body

  if (!data) {
    res.status(400)
    throw new Error('Missing eSewa response data')
  }

  let decoded = null
  try {
    decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf8'))
  } catch {
    res.status(400)
    throw new Error('Invalid eSewa response data')
  }

  const { status, total_amount, transaction_uuid, product_code } = decoded

  if (!transaction_uuid) {
    res.status(400)
    throw new Error('Missing transaction_uuid in eSewa response')
  }

  // The order keeps the transaction_uuid value we generated at initiation.
  const order = await Order.findOne({
    user: req.user._id,
    transactionId: transaction_uuid,
    paymentMethod: 'esewa',
  })

  if (!order) {
    res.status(404)
    throw new Error('Order not found for this transaction')
  }

  if (order.paymentStatus === 'paid' && order.stockDeducted) {
    return res.json({
      success: true,
      message: 'Payment already verified',
      order,
    })
  }

  // 1) Signature check on the response returned by eSewa (filters tampering).
  if (!verifyEsewaCallback(decoded)) {
    res.status(400)
    throw new Error('Invalid eSewa response signature')
  }

  // 2) Field checks: the callback must match our stored order + merchant config.
  if (status !== 'COMPLETE') {
    await Order.updateOne({ _id: order._id }, { $set: { paymentStatus: 'failed' } })
    res.status(400)
    throw new Error('Payment was not completed on eSewa')
  }

  if (Number(total_amount) !== order.totalAmount) {
    res.status(400)
    throw new Error('Amount mismatch in eSewa response')
  }

  if (product_code !== ESEWA_PRODUCT_CODE) {
    res.status(400)
    throw new Error('Product code mismatch in eSewa response')
  }

  // 3) Server-to-server status check with eSewa (authoritative verification).
  const verificationResponse = await requestEsewaStatus({
    productCode: product_code,
    totalAmount: order.totalAmount,
    transactionUuid: transaction_uuid,
  })

  if (verificationResponse.status !== 'COMPLETE') {
    await Order.updateOne({ _id: order._id }, { $set: { paymentStatus: 'failed' } })
    res.status(400)
    throw new Error('eSewa could not confirm this transaction')
  }

  // 4) Atomically claim the order. Only one concurrent verify request may move this
  //    order from pending -> paid, which prevents duplicate stock deduction and the
  //    Mongoose VersionError that stale document.save() calls throw under a race.
  const claimed = await Order.findOneAndUpdate(
    {
      _id: order._id,
      paymentStatus: 'pending',
      stockDeducted: false,
    },
    {
      $set: {
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        esewaRefId: decoded.transaction_code || null,
      },
    },
    { new: true }
  )

  if (!claimed) {
    // A previous (or parallel) request already verified this order.
    const fresh = await Order.findById(order._id)
    return res.json({
      success: true,
      message: 'Payment already verified',
      order: fresh,
    })
  }

  await Promise.all(
    claimed.items.map((item) =>
      Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      )
    )
  )

  await Order.updateOne({ _id: claimed._id }, { $set: { stockDeducted: true } })

  // 5) Clear the cart best-effort. The order is already paid, so a cart failure must
  //    never surface as a verification error.
  try {
    await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } })
  } catch {
    // ignore
  }

  res.json({
    success: true,
    message: 'Payment verified successfully',
    order: await Order.findById(claimed._id),
  })
})

function verifyEsewaCallback(decoded) {
  const fieldNames = decoded.signed_field_names
  const signature = decoded.signature

  if (!fieldNames || !signature) {
    return false
  }

  if (!process.env.ESEWA_SECRET_KEY) {
    return false
  }

  const names = String(fieldNames).split(',')
  const message = names.map((name) => `${name}=${decoded[name]}`).join(',')

  const expected = crypto
    .createHmac('sha256', process.env.ESEWA_SECRET_KEY)
    .update(message)
    .digest('base64')

  return expected === signature
}

function requestEsewaStatus({ productCode, totalAmount, transactionUuid }) {
  const url = `${ESEWA_STATUS_URL}?product_code=${productCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`
  return requestJson(url)
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    let client
    try {
      client = new URL(url)
    } catch {
      reject(new Error('Invalid eSewa verification URL'))
      return
    }
    const lib = client.protocol === 'https:' ? https : http
    lib
      .get(url, { headers: { Accept: 'application/json' } }, (response) => {
        let raw = ''
        response.on('data', (chunk) => {
          raw += chunk
        })
        response.on('end', () => {
          try {
            resolve(JSON.parse(raw))
          } catch {
            reject(new Error('Invalid response from eSewa'))
          }
        })
      })
      .on('error', reject)
  })
}