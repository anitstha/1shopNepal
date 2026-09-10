const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  initiateEsewaPayment,
  verifyEsewaPayment,
} = require('../controllers/paymentController')

router.post('/esewa/initiate', protect, initiateEsewaPayment)
router.post('/esewa/verify', protect, verifyEsewaPayment)

module.exports = router