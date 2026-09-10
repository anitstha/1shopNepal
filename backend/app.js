const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

const requestLogger = require('./middleware/requestLogger')
const healthRoutes = require('./routes/healthRoutes')
const authRoutes = require('./routes/authRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const recommendationRoutes = require('./routes/recommendationRoutes')
const cartRoutes = require('./routes/cartRoutes')
const wishlistRoutes = require('./routes/wishlistRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const adminRoutes = require('./routes/adminRoutes')
const seoRoutes = require('./routes/seoRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(requestLogger)

app.use('/api', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/recommendations', recommendationRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api', reviewRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminRoutes)

app.use(seoRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
