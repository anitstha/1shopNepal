const express = require('express')
const {
  uploadProductImages,
  getUploadStatus,
} = require('../controllers/uploadController')
const { protect, admin } = require('../middleware/authMiddleware')
const { upload } = require('../middleware/uploadMiddleware')

const router = express.Router()

router.get('/config', getUploadStatus)
router.post('/', protect, admin, upload.array('images', 6), uploadProductImages)

module.exports = router