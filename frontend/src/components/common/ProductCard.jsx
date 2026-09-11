import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Star, Heart, ShoppingCart, Check } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'

function ProductCard({ product }) {
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const name = product.name || 'Product'
  const image = product.images?.[0] || product.image
  const id = product._id || product.id
  const slug = product.slug || id
  const regularPrice = Number(product.price || 0)
  const salePrice = product.discountPrice
    ? Number(product.discountPrice)
    : regularPrice
  const discount =
    regularPrice > 0 && salePrice > 0 && salePrice < regularPrice
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0
  const categoryName = product.category?.name || product.categoryName || 'Category'
  const rating = Number(product.rating || 0)
  const reviewCount = product.reviewCount ?? product.reviews ?? 0
  const wished = isWishlisted(id)
  const inStock = Number(product.stock ?? 1) > 0

  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Please sign in to add items to your cart')
      window.location.href = '/login'
      return
    }
    try {
      await addToCart(id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.info('Please sign in to save items to your wishlist')
      window.location.href = '/login'
      return
    }
    try {
      await toggleWishlist(id)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <article className="group relative bg-white rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/5 transition-all duration-300 overflow-hidden">
      {discount > 0 && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-semibold rounded-md bg-neutral-900 text-white">
          -{discount}%
        </span>
      )}

      <button
        onClick={handleToggleWishlist}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            wished ? 'fill-red-500 text-red-500' : 'text-neutral-400'
          }`}
        />
      </button>

      <Link to={`/products/${slug}`} className="block">
        <div className="bg-neutral-100 aspect-square overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-400 font-semibold">
          {categoryName}
        </p>
        <Link
          to={`/products/${slug}`}
          className="block text-sm font-semibold text-neutral-900 hover:text-black line-clamp-1 mt-1"
        >
          {name}
        </Link>

        <div className="mt-1.5 flex items-center gap-1 text-xs text-neutral-500">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-medium text-neutral-700">
            {rating ? rating.toFixed(1) : 'New'}
          </span>
          {reviewCount > 0 && <span>({reviewCount})</span>}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-neutral-900">
                Rs. {salePrice.toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="hidden sm:inline text-sm text-neutral-400 line-through">
                  Rs. {regularPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] font-medium ${
                inStock ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            aria-label="Add to cart"
            className={`p-2.5 rounded-xl transition-colors ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-neutral-900 text-white hover:bg-black'
            } ${!inStock ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard