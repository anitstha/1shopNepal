const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController')

router
  .route('/')
  .get(protect, getMyOrders)
  .post(protect, createOrder)

router.route('/:id').get(protect, getOrderById)

router.route('/:id/status').put(protect, admin, updateOrderStatus)

module.exports = router