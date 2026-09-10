/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { wishlistApi } from '../services/api'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [rawProducts, setRawProducts] = useState([])

  useEffect(() => {
    if (!user) return
    let active = true
    wishlistApi
      .getWishlist()
      .then((d) => {
        if (active) setRawProducts(d.products)
      })
      .catch(() => {
        if (active) setRawProducts([])
      })
    return () => {
      active = false
    }
  }, [user])

  const products = user ? rawProducts : []
  const ids = products.map((p) => p._id)

  const addToWishlist = useCallback(async (productId) => {
    const d = await wishlistApi.addToWishlist(productId)
    setRawProducts(d.products)
    toast.success('Added to wishlist')
    return d
  }, [])

  const removeFromWishlist = useCallback(async (productId) => {
    const d = await wishlistApi.removeFromWishlist(productId)
    setRawProducts(d.products)
    toast.success('Removed from wishlist')
    return d
  }, [])

  const toggleWishlist = useCallback(
    async (productId) => {
      if (ids.includes(productId)) return removeFromWishlist(productId)
      return addToWishlist(productId)
    },
    [ids, addToWishlist, removeFromWishlist]
  )

  const isWishlisted = useCallback((productId) => ids.includes(productId), [ids])

  return (
    <WishlistContext.Provider
      value={{
        products,
        count: products.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}