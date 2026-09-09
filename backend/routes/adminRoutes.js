const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')
const {
  getDashboardStats,
  getAdminOrders,
  getAdminUsers,
  updateAdminUser,
  getAdminReviews,
} = require('../controllers/adminController')

router.use(protect, admin)

router.get('/stats', getDashboardStats)
router.get('/orders', getAdminOrders)
router.get('/reviews', getAdminReviews)
router.get('/users', getAdminUsers)
router.put('/users/:id', updateAdminUser)

module.exports = router