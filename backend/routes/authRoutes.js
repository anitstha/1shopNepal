const express = require('express')
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  uploadProfileImage,
} = require('../controllers/authController')
const { protect, admin } = require('../middleware/authMiddleware')
const { upload } = require('../middleware/uploadMiddleware')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.put('/me', protect, updateProfile)
router.post('/profile-image', protect, upload.single('image'), uploadProfileImage)
router.get('/admin-check', protect, admin, (req, res) =>
  res.json({ success: true, message: 'Admin access granted' })
)

module.exports = router