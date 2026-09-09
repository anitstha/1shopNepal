const mongoose = require('mongoose')
const Product = require('../models/Product')

// ---------------------------------------------------------------------------
// Recommendation scoring — a simple, explainable heuristic (NO machine learning)
//
// Every other product in the catalog is compared with the product being viewed
// and given a weighted score out of 100. The weights are deliberately chosen as
// round numbers so the algorithm is easy to explain in a viva:
//
//   Category match    +40   products in the same category ("same category")
//   Price similarity  +25   the closer the price, the more points
//   Rating quality    +15   higher customer rating => more points
//   Popularity        +20   more reviews => more points
//                        ----
//   Maximum score       100
//
// Example: a candidate sharing the source's category (+40), priced 10% apart
// (+22.5), rated 4.5/5 (+13.5) with a high review count (+18) scores 94/100.
// ---------------------------------------------------------------------------

const WEIGHTS = {
  CATEGORY: 40, // binary: same category or not
  PRICE: 25, // scaled 0..25 by how close the price is
  RATING: 15, // scaled 0..15 (rating / 5)
  POPULARITY: 20, // scaled 0..20 (reviewCount relative to the most-reviewed product)
}

// Effective price = discounted price when available, else the regular price.
const effectivePrice = (p) => {
  if (p.discountPrice !== undefined && p.discountPrice !== null) {
    return Number(p.discountPrice)
  }
  return Number(p.price) || 0
}

// Categories may arrive as a populated object ({ _id, name, slug }), a raw
// ObjectId, or a string. Normalize to the id string before comparing.
const categoryId = (p) => {
  if (!p.category) return ''
  if (typeof p.category === 'object') {
    return String(p.category._id || p.category)
  }
  return String(p.category)
}

const sameCategory = (a, b) => {
  const idA = categoryId(a)
  return idA !== '' && idA === categoryId(b)
}

// Price similarity: 0 when prices are far apart, up to 1 when identical.
// Uses the relative difference so the scale works for cheap and expensive items.
const priceSimilarity = (a, b) => {
  const pa = effectivePrice(a)
  const pb = effectivePrice(b)
  const max = Math.max(pa, pb, 1)
  if (max === 0) return 0
  return Math.max(0, 1 - Math.abs(pa - pb) / max)
}

// Rating quality: rating is 0..5, express it as a 0..1 fraction.
const ratingQuality = (p) => Math.min(Math.max((p.rating || 0) / 5, 0), 1)

// Computes the 0..100 recommendation score for one candidate product and the
// list of human-readable "why" reasons shown in the UI.
const scoreCandidate = (source, candidate, maxReviews) => {
  let score = 0
  const reasons = []

  if (sameCategory(source, candidate)) {
    score += WEIGHTS.CATEGORY
    reasons.push('same category')
  }

  const pricePoints = WEIGHTS.PRICE * priceSimilarity(source, candidate)
  if (pricePoints >= WEIGHTS.PRICE * 0.6) {
    reasons.push('similar price')
  }
  score += pricePoints

  const ratingPoints = WEIGHTS.RATING * ratingQuality(candidate)
  if (ratingPoints >= WEIGHTS.RATING * 0.8) {
    reasons.push('highly rated')
  }
  score += ratingPoints

  const popularityPoints = maxReviews > 0
    ? WEIGHTS.POPULARITY * Math.min((candidate.reviewCount || 0) / maxReviews, 1)
    : 0
  if (popularityPoints >= WEIGHTS.POPULARITY * 0.5) {
    reasons.push('popular')
  }
  score += popularityPoints

  return {
    score: Math.round(score * 10) / 10,
    reasons,
  }
}

// Shapes the raw product document into the lean recommendation payload used by
// the API and frontend (score + reasons included for explainability).
const toRecommendation = (candidate, source, maxReviews, { withScore } = {}) => {
  const base = {
    _id: candidate._id,
    name: candidate.name,
    slug: candidate.slug,
    price: candidate.price,
    discountPrice: candidate.discountPrice,
    images: candidate.images,
    category: candidate.category,
    brand: candidate.brand,
    stock: candidate.stock,
    rating: candidate.rating,
    reviewCount: candidate.reviewCount,
    isSameCategory: sameCategory(source, candidate),
  }
  if (!withScore) return base
  const { score, reasons } = scoreCandidate(source, candidate, maxReviews)
  return { ...base, score, reasons }
}

// Interleave two sorted lists (same-category and cross-category) so the
// "Recommended For You" grid shows variety instead of one big block of same
// category products, while still ranking the best matches first.
const interleave = (listA, listB, limit) => {
  const result = []
  let i = 0
  let j = 0
  while (result.length < limit && (i < listA.length || j < listB.length)) {
    if (i < listA.length && (j >= listB.length || result.length % 2 === 0)) {
      result.push(listA[i])
      i += 1
    } else if (j < listB.length) {
      result.push(listB[j])
      j += 1
    }
  }
  return result
}

/**
 * Returns { product, recommended, related } for a given product.
 * - product:     the product being viewed (or null if not found)
 * - recommended: up to `limit` (4-8) best-scoring products across the catalog,
 *                interleaved between same-category and cross-category items
 * - related:     up to 8 same-category products, best-scored first
 * Both "recommended" and "related" exclude the viewed product and never repeat
 * a product.
 */
const getRecommendations = async (productId, { limit = 8 } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return { product: null, recommended: [], related: [] }
  }

  const product = await Product.findById(productId).populate('category', 'name slug').lean()
  if (!product) {
    return { product: null, recommended: [], related: [] }
  }

  const size = Math.min(8, Math.max(4, limit))

  // All other products become candidates (the viewed product is excluded).
  const candidates = await Product.find({ _id: { $ne: product._id } })
    .populate('category', 'name slug')
    .lean()

  if (candidates.length === 0) {
    return { product, recommended: [], related: [] }
  }

  // Popularity normalization: the most-reviewed candidate sets the scale below.
  const maxReviews = Math.max(...candidates.map((c) => c.reviewCount || 0))

  const sameCat = []
  const otherCat = []
  for (const candidate of candidates) {
    const { score, reasons } = scoreCandidate(product, candidate, maxReviews)
    const rec = toRecommendation(candidate, product, maxReviews, { withScore: true })
    rec.score = score
    rec.reasons = reasons
    // Deduplication is handled by Mongo (each document appears once) plus the
    // explicit `$ne` on the viewed product, so no product can appear twice.
    if (rec.isSameCategory) sameCat.push(rec)
    else otherCat.push(rec)
  }

  const sortByScore = (a, b) => b.score - a.score
  sameCat.sort(sortByScore)
  otherCat.sort(sortByScore)

  return {
    product,
    recommended: interleave(sameCat, otherCat, size),
    related: sameCat.slice(0, Math.min(8, size)).map((rec) =>
      toRecommendation(rec, product, maxReviews)
    ),
  }
}

module.exports = {
  getRecommendations,
  // exported for tests / potential reuse
  scoreCandidate,
  effectivePrice,
  WEIGHTS,
}