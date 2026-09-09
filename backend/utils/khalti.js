const KHALTI_BASE_URL = process.env.KHALTI_API_URL || 'https://khalti.com'

const isMockMode = () => !process.env.KHALTI_SECRET_KEY

const toPaisa = (amountNpr) => Math.round(Number(amountNpr) * 100)

const authHeaders = () => ({
  Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
  'Content-Type': 'application/json',
})

async function khaltiRequest(path, payload) {
  const response = await fetch(`${KHALTI_BASE_URL}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })

  let data = {}
  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    const raw =
      data.detail || data.error_key || data.errors || data.error || `Khalti request failed (${response.status})`
    const message = typeof raw === 'string' ? raw : JSON.stringify(raw)
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return data
}

const initiatePayment = (payload) => khaltiRequest('/api/v2/epayment/initiate/', payload)

const lookupPayment = (pidx) => khaltiRequest('/api/v2/epayment/lookup/', { pidx })

module.exports = {
  isMockMode,
  toPaisa,
  initiatePayment,
  lookupPayment,
}