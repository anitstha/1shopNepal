const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  if (err.status && Number.isInteger(err.status) && err.status >= 400) {
    statusCode = err.status
  }

  if (err.name === 'MulterError') {
    statusCode = 400
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Image files cannot exceed 5MB'
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'You can upload up to 6 images at once'
    } else {
      message = `Upload failed: ${err.message}`
    }
  }

  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Invalid resource identifier'
  }

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
  }

  if (err.code === 11000) {
    statusCode = 400
    message = 'Duplicate value entered'
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}

module.exports = { notFound, errorHandler }
