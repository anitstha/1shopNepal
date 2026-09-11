const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const asyncHandler = require('../utils/asyncHandler')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const cloudinary = require('cloudinary').v2

const AVATAR_DIR = path.join(__dirname, '..', 'uploads', 'avatars')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const saveAvatarLocally = (buffer, originalname) => {
  if (!fs.existsSync(AVATAR_DIR)) {
    fs.mkdirSync(AVATAR_DIR, { recursive: true })
  }
  const ext = path.extname(originalname) || '.jpg'
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
  fs.writeFileSync(path.join(AVATAR_DIR, filename), buffer)
  return `/uploads/avatars/${filename}`
}

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: '1shopnepal/avatars', resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    )
    stream.end(buffer)
  })

// Cloudinary is used when configured; otherwise fall back to local disk so the
// app still works in development without Cloudinary credentials.
const uploadAvatar = async (buffer, originalname) => {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return uploadToCloudinary(buffer)
  }
  return saveAvatarLocally(buffer, originalname)
}

const buildUserPayload = (user, { withToken = true } = {}) => ({
  success: true,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  profileImage: user.profileImage || '',
  role: user.role,
  isActive: user.isActive,
  ...(withToken ? { token: generateToken(user._id) } : {}),
})

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please provide name, email and password')
  }

  if (password.length < 6) {
    res.status(400)
    throw new Error('Password must be at least 6 characters')
  }

  const emailRegex = /^\S+@\S+\.\S+$/
  if (!emailRegex.test(email)) {
    res.status(400)
    throw new Error('Please provide a valid email address')
  }

  const userExists = await User.findOne({ email: email.toLowerCase() })
  if (userExists) {
    res.status(400)
    throw new Error('An account with this email already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  })

  res.status(201).json(buildUserPayload(user))
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide email and password')
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  if (user.isActive === false) {
    res.status(401)
    throw new Error('Your account has been disabled. Contact support.')
  }

  res.json(buildUserPayload(user))
})

const getMe = asyncHandler(async (req, res) => {
  res.json(buildUserPayload(req.user, { withToken: false }))
})

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const { name, email, phone, profileImage, currentPassword, newPassword } = req.body

  if (name !== undefined) {
    const trimmed = String(name || '').trim()
    if (trimmed.length < 2) {
      res.status(400)
      throw new Error('Name must be at least 2 characters')
    }
    user.name = trimmed
  }

  if (email !== undefined) {
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(String(email || ''))) {
      res.status(400)
      throw new Error('Please provide a valid email address')
    }
    const normalized = String(email).toLowerCase().trim()
    if (normalized !== user.email) {
      const exists = await User.findOne({ email: normalized })
      if (exists) {
        res.status(400)
        throw new Error('An account with this email already exists')
      }
      user.email = normalized
    }
  }

  if (phone !== undefined) {
    const trimmed = String(phone || '').trim()
    if (trimmed && !/^[0-9]{10}$/.test(trimmed)) {
      res.status(400)
      throw new Error('Phone number must be 10 digits')
    }
    user.phone = trimmed
  }

  if (profileImage !== undefined) {
    user.profileImage = String(profileImage || '')
  }

  if (newPassword !== undefined && String(newPassword).length > 0) {
    if (!currentPassword) {
      res.status(400)
      throw new Error('Please provide your current password')
    }
    if (String(newPassword).length < 6) {
      res.status(400)
      throw new Error('New password must be at least 6 characters')
    }
    const userWithPassword = await User.findById(req.user._id).select('+password')
    if (!(await userWithPassword.matchPassword(currentPassword))) {
      res.status(400)
      throw new Error('Current password is incorrect')
    }
    user.password = newPassword
  }

  await user.save()
  res.json(buildUserPayload(user, { withToken: false }))
})

const uploadProfileImage = asyncHandler(async (req, res) => {
  const file = req.file

  if (!file) {
    res.status(400)
    throw new Error('No image file was uploaded')
  }

  const saved = await uploadAvatar(file.buffer, file.originalname)
  const imageUrl = saved.startsWith('http')
    ? saved
    : `${req.protocol}://${req.get('host')}${saved}`

  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  user.profileImage = imageUrl
  await user.save()

  res.json(buildUserPayload(user, { withToken: false }))
})

module.exports = { registerUser, loginUser, getMe, updateProfile, uploadProfileImage }