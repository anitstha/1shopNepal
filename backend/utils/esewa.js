const crypto = require('crypto')

function generateEsewaSignature(totalAmount, transactionUuid, productCode) {
  const secretKey = process.env.ESEWA_SECRET_KEY
  if (!secretKey) {
    throw new Error('ESEWA_SECRET_KEY is not configured')
  }

  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`

  const hmac = crypto.createHmac('sha256', secretKey).update(message).digest('base64')

  return hmac
}

function generateTransactionUuid() {
  return crypto.randomUUID()
}

module.exports = { generateEsewaSignature, generateTransactionUuid }
