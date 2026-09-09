/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartApi } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

const mapItems = (cart) =>
  cart.items
    .filter((i) => i.product)
    .map((i) => ({
      _id: i._id,
      product: {
        _id: i.product._id,
        name: i.product.name,
        price: i.product.price,
        discountPrice: i.product.discountPrice,
        stock: i.product.stock,
        image: i.product.images?.[0] || null,
        slug: i.product.slug,
      },
      quantity: i.quantity,
      price: i.price,
    }))

const mapTotal = (mapped) =>
  mapped.reduce((sum, i) => sum + i.price * i.quantity, 0)

const mapCount = (mapped) =>
  mapped.reduce((sum, i) => sum + i.quantity, 0)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(() => !!user)

  useEffect(() => {
    if (!user) return

    let active = true
    cartApi
      .getCart()
      .then((data) => {
        if (!active) return
        const mapped = mapItems(data)
        setCartItems(mapped)
      })
      .catch(() => {
        if (active) setCartItems([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [user])

  const handleCartPayload = (cart) => {
    const mapped = mapItems(cart)
    setCartItems(mapped)
  }

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      const data = await cartApi.addToCart(productId, quantity)
      if (data.cart) handleCartPayload(data.cart)
      return data
    },
    []
  )

  const updateItem = useCallback(async (productId, quantity) => {
    const data = await cartApi.updateItem(productId, quantity)
    if (data.cart) handleCartPayload(data.cart)
    return data
  }, [])

  const removeItem = useCallback(async (productId) => {
    const data = await cartApi.removeItem(productId)
    if (data.cart) handleCartPayload(data.cart)
    return data
  }, [])

  const clearCart = useCallback(async () => {
    const data = await cartApi.clearCart()
    if (data.cart) setCartItems([])
    return data
  }, [])

  const items = user ? cartItems : []
  const subtotal = user ? mapTotal(cartItems) : 0
  const itemCount = user ? mapCount(cartItems) : 0

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        itemCount,
        loading,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}