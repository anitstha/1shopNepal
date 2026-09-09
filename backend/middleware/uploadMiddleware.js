const multer = require('multer')

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
    const error = new Error(
      `Invalid file type "${file.mimetype}". Only JPG, PNG, WEBP and GIF images are allowed`
    )
    error.status = 400
    cb(error, false)
    return
  }

  if (file.originalname && /\.(exe|sh|bat|js|html)$/i.test(file.originalname)) {
    const error = new Error('File extension is not allowed')
    error.status = 400
    cb(error, false)
    return
  }

  cb(null, true)
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE,
    files: 6,
  },
  fileFilter,
})

module.exports = { upload, ALLOWED_MIMETYPES, MAX_IMAGE_SIZE }