const Review = require('../models/Review')
const Product = require('../models/Product')
const asyncHandler = require('../utils/asyncHandler')
const mongoose = require('mongoose')

const toObjectId = (id) =>
  typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id

const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: toObjectId(productId) } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    })
  } else {
    await Product.findByIdAndUpdate(productId, { rating: 0, reviewCount: 0 })
  }
}

exports.getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 })

  res.json({ reviews })
})

exports.createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const { productId } = req.params

  const parsedRating = Number(rating)
  if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
    res.status(400)
    throw new Error('Rating must be between 1 and 5')
  }

  const product = await Product.findById(productId)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const existing = await Review.findOne({ user: req.user._id, product: productId })
  if (existing) {
    res.status(400)
    throw new Error('You have already reviewed this product. You can edit your existing review.')
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: parsedRating,
    comment,
  })

  await updateProductRating(productId)

  const populated = await review.populate('user', 'name')
  res.status(201).json({ review: populated })
})

exports.updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    res.status(404)
    throw new Error('Review not found')
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorized to edit this review')
  }

  const { rating, comment } = req.body
  if (rating !== undefined) {
    const parsedRating = Number(rating)
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      res.status(400)
      throw new Error('Rating must be between 1 and 5')
    }
    review.rating = parsedRating
  }
  if (comment !== undefined) review.comment = comment

  await review.save()
  await updateProductRating(review.product)

  const populated = await review.populate('user', 'name')
  res.json({ review: populated })
})

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    res.status(404)
    throw new Error('Review not found')
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403)
    throw new Error('Not authorized to delete this review')
  }

  const productId = review.product
  await Review.findByIdAndDelete(req.params.id)
  await updateProductRating(productId)

  res.json({ message: 'Review removed' })
})
