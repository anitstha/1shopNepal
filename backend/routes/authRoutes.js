const express = require('express')
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/authController')
const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/admin-check', protect, admin, (req, res) =>
  res.json({ success: true, message: 'Admin access granted' })
)

module.exports = router