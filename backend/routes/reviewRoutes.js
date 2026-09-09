const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController')

router.get('/products/:productId/reviews', getProductReviews)
router.post('/products/:productId/reviews', protect, createReview)
router.put('/reviews/:id', protect, updateReview)
router.delete('/reviews/:id', protect, deleteReview)

module.exports = router
