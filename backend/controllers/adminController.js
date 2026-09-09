const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')
const Review = require('../models/Review')
const asyncHandler = require('../utils/asyncHandler')

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, orderStatusSummary, ordersAgg] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
      ]),
    ])

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')

  const bestSellingProducts = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        name: 1,
        totalSold: 1,
        revenue: 1,
        image: { $arrayElemAt: ['$product.images', 0] },
        stock: '$product.stock',
      },
    },
  ])

  const statusMap = {}
  orderStatusSummary.forEach((item) => {
    statusMap[item._id] = item.count
  })

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: ordersAgg.length ? ordersAgg[0].totalRevenue : 0,
      orderStatusSummary: statusMap,
    },
    recentOrders,
    bestSellingProducts,
  })
})

exports.getAdminOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query

  const filter = {}
  if (status && status !== 'all') filter.orderStatus = status
  if (search) {
    const or = [
      { 'shippingAddress.fullName': new RegExp(search, 'i') },
      { 'shippingAddress.city': new RegExp(search, 'i') },
    ]
    if (/^[0-9a-fA-F]{24}$/.test(search)) {
      or.push({ _id: search })
    }
    filter.$or = or
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
  const skip = (pageNum - 1) * limitNum

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email'),
    Order.countDocuments(filter),
  ])

  res.json({
    success: true,
    count: orders.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    orders,
  })
})

exports.getAdminUsers = asyncHandler(async (req, res) => {
  const { search } = req.query
  const filter = search
    ? {
        $or: [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
        ],
      }
    : {}

  const users = await User.find(filter).sort({ createdAt: -1 })

  res.json({
    success: true,
    count: users.length,
    users,
  })
})

exports.updateAdminUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400)
    throw new Error('Admins cannot change their own role or status')
  }

  const { role, isActive } = req.body

  if (role !== undefined) {
    if (!['customer', 'admin'].includes(role)) {
      res.status(400)
      throw new Error('Role must be customer or admin')
    }
    user.role = role
  }

  if (isActive !== undefined) {
    user.isActive = Boolean(isActive)
  }

  const updated = await user.save()

  res.json({
    success: true,
    message: 'User updated',
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
    },
  })
})

exports.getAdminReviews = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
  } = req.query

  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
  const skip = (pageNum - 1) * limitNum

  const filter = search
    ? { comment: new RegExp(search, 'i') }
    : {}

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email')
      .populate('product', 'name images price'),
    Review.countDocuments(filter),
  ])

  res.json({
    success: true,
    count: reviews.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    reviews,
  })
})