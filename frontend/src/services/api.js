import { getToken } from '../utils/auth'

const API_URL = 'https://oneshopnepal-backend.onrender.com/api'

const FILE_ORIGIN = API_URL.replace(/\/api\/?$/, '')

export const toAbsoluteUrl = (path) =>
  !path ? '' : path.startsWith('http') ? path : `${FILE_ORIGIN}${path}`

const request = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong')
    error.status = response.status
    throw error
  }

  return data
}

const requestMultipart = async (path, formData) => {
  const headers = {}

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Upload failed')
    error.status = response.status
    throw error
  }

  return data
}

export const authApi = {
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) =>
    request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

export const categoryApi = {
  getCategories: () => request('/categories'),
  getCategoryById: (id) => request(`/categories/${id}`),
  createCategory: (data) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id, data) =>
    request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: 'DELETE',
    }),
}

export const productApi = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString()
    return request(`/products${query ? `?${query}` : ''}`)
  },
  getProductById: (id) => request(`/products/${id}`),
  createProduct: (data) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id, data) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProduct: (id) =>
    request(`/products/${id}`, {
      method: 'DELETE',
    }),
}

export const recommendationApi = {
  getRecommendationsFor: (productId) => request(`/recommendations/${productId}`),
}

export const uploadApi = {
  uploadProfileImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return requestMultipart('/auth/profile-image', formData)
  },
}

export const cartApi = {
  getCart: () => request('/cart'),
  addToCart: (productId, quantity = 1) =>
    request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  updateItem: (productId, quantity) =>
    request(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  removeItem: (productId) =>
    request(`/cart/${productId}`, {
      method: 'DELETE',
    }),
  clearCart: () =>
    request('/cart', {
      method: 'DELETE',
    }),
}

export const wishlistApi = {
  getWishlist: () => request('/wishlist'),
  addToWishlist: (productId) =>
    request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),
  removeFromWishlist: (productId) =>
    request(`/wishlist/${productId}`, {
      method: 'DELETE',
    }),
  moveToCart: (productId) =>
    request(`/wishlist/${productId}/move-to-cart`, {
      method: 'POST',
    }),
}

export const reviewApi = {
  getProductReviews: (productId) => request(`/products/${productId}/reviews`),
  createReview: (productId, data) =>
    request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateReview: (id, data) =>
    request(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteReview: (id) =>
    request(`/reviews/${id}`, {
      method: 'DELETE',
    }),
}

export const orderApi = {
  createOrder: (data) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMyOrders: () => request('/orders'),
  getOrderById: (id) => request(`/orders/${id}`),
  updateOrderStatus: (id, data) =>
    request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

export const paymentApi = {
  initiateEsewa: (data) =>
    request('/payments/esewa/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyEsewa: (data) =>
    request('/payments/esewa/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export const adminApi = {
  getStats: () => request('/admin/stats'),
  getOrders: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString()
    return request(`/admin/orders${query ? `?${query}` : ''}`)
  },
  getUsers: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString()
    return request(`/admin/users${query ? `?${query}` : ''}`)
  },
  updateUser: (id, data) =>
    request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteUser: (id) =>
    request(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
  getReviews: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString()
    return request(`/admin/reviews${query ? `?${query}` : ''}`)
  },
}

export default request
