const asyncHandler = require('../utils/asyncHandler')
const { getRecommendations } = require('../services/recommendationService')

const getRecommendationsByProduct = asyncHandler(async (req, res) => {
  const result = await getRecommendations(req.params.productId)

  if (!result.product) {
    res.status(404)
    throw new Error('Product not found')
  }

  res.json({
    success: true,
    product: result.product,
    recommended: result.recommended,
    related: result.related,
  })
})

module.exports = {
  getRecommendationsByProduct,
}