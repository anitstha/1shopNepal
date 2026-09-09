const express = require('express')
const router = express.Router()
const {
  getRecommendationsByProduct,
} = require('../controllers/recommendationController')

router.get('/:productId', getRecommendationsByProduct)

module.exports = router