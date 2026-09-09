import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import ProductCard from '../components/common/ProductCard'
import Seo from '../components/common/Seo'
import { useWishlist } from '../context/WishlistContext'

function Wishlist() {
  const { products } = useWishlist()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Seo title="My Wishlist | 1Shop Nepal" description="Products you saved to your 1Shop Nepal wishlist." canonical="/wishlist" noindex />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
        <p className="text-gray-600 mt-2">
          {products.length === 0
            ? 'Products you save to your wishlist will appear here'
            : `You have ${products.length} saved ${products.length === 1 ? 'item' : 'items'}`}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="mt-4 text-lg font-semibold text-gray-900">Your wishlist is empty</p>
          <p className="text-sm text-gray-500 mt-1">
            Tap the heart on any product to save it for later.
          </p>
          <Link
            to="/products"
            className="inline-block mt-6 px-6 py-3 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist