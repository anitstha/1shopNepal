const asyncHandler = require('../utils/asyncHandler')
const { configureCloudinary, isCloudinaryConfigured } = require('../config/cloudinary')

const uploadImageToCloudinary = (cloudinary, buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const publicId = `products/${Date.now()}-${originalname
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 50)}`

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: '1shopnepal/products',
        resource_type: 'image',
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve({ url: result.secure_url, publicId: result.public_id })
        }
      }
    )

    uploadStream.end(buffer)
  })
}

const getUploadStatus = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    cloudinaryConfigured: isCloudinaryConfigured(),
  })
})

const uploadProductImages = asyncHandler(async (req, res) => {
  const files = req.files

  if (!files || files.length === 0) {
    res.status(400)
    throw new Error('No image files were uploaded')
  }

  const cloudinary = configureCloudinary()

  if (!cloudinary) {
    res.status(503)
    throw new Error(
      'Image upload is not enabled. Cloudinary is not configured (missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET). Paste image URLs instead, or configure Cloudinary in the backend .env file.'
    )
  }

  const uploaded = []
  for (const file of files) {
    try {
      const data = await uploadImageToCloudinary(
        cloudinary,
        file.buffer,
        file.originalname
      )
      uploaded.push(data)
    } catch (error) {
      res.status(500)
      throw new Error(`Failed to upload image "${file.originalname}": ${error.message}`)
    }
  }

  res.status(201).json({
    success: true,
    count: uploaded.length,
    images: uploaded.map((i) => i.url),
    cloudinaryConfigured: true,
  })
})

module.exports = { uploadProductImages, getUploadStatus, uploadImageToCloudinary }