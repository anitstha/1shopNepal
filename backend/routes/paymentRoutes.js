const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
} = require('../controllers/paymentController')

router.post('/khalti/initiate', protect, initiateKhaltiPayment)
router.post('/khalti/verify', protect, verifyKhaltiPayment)

module.exports = router