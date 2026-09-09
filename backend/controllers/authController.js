const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const asyncHandler = require('../utils/asyncHandler')

const buildUserPayload = (user, { withToken = true } = {}) => ({
  success: true,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
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

module.exports = { registerUser, loginUser, getMe }