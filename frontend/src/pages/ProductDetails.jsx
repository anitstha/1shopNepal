import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Heart, ShoppingCart, Check, Minus, Plus, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import ProductCard from '../components/common/ProductCard'
import Seo from '../components/common/Seo'
import ReviewsSection from '../components/reviews/ReviewsSection'
import { productApi, recommendationApi } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { truncate, siteUrl } from '../utils/seo'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const [recommended, setRecommended] = useState([])
  const [related, setRelated] = useState([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await productApi.getProductById(id)
        if (!mounted) return
        setProduct(res.product)
        try {
          const rec = await recommendationApi.getRecommendationsFor(res.product._id)
          if (!mounted) return
          setRecommended(rec.recommended || [])
          setRelated(rec.related || [])
        } catch {
          // recommendations are optional
        }
      } catch {
        if (mounted) setNotFound(true)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    try {
      await addToCart(product._id, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } catch (err) {
      window.alert(err.message)
    }
  }

  const handleProductUpdate = async () => {
    try {
      const res = await productApi.getProductById(id)
      setProduct(res.product)
    } catch {
      // keep existing product data if refresh fails
    }
  }

  if (loading) {
    return (
      <>
        <Seo title="Loading... | 1Shop Nepal" noindex />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="animate-pulse grid md:grid-cols-2 gap-10">
            <div className="bg-gray-200 h-96 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
              <div className="h-10 w-40 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </>
    )
  }

  if (notFound || !product) {
    return (
      <>
        <Seo title="Product Not Found | 1Shop Nepal" noindex />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Product Not Found</h1>
          <Link
            to="/products"
            className="inline-block mt-6 px-5 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg"
          >
            Browse Products
          </Link>
        </div>
      </>
    )
  }

  const images = product.images?.length ? product.images : ['']
  const regularPrice = Number(product.price || 0)
  const salePrice = product.discountPrice ? Number(product.discountPrice) : regularPrice
  const discount =
    regularPrice > 0 && salePrice > 0 && salePrice < regularPrice
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0
  const inStock = Number(product.stock ?? 0) > 0
  const specs = product.specifications
    ? Object.entries(product.specifications)
    : []
  const recommendedReasons = [
    ...new Set((recommended || []).flatMap((p) => p.reasons || [])),
  ]

  const productUrl = `${siteUrl()}/products/${product.slug || product._id}`
  const origin = siteUrl()
  const seoDescription =
    truncate(product.description) ||
    `Buy ${product.name}${product.brand ? ` by ${product.brand}` : ''} online in Nepal for Rs. ${salePrice.toLocaleString()}. Fast delivery across Nepal.`

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images[0] ? images : undefined,
    description: product.description || seoDescription,
    sku: product._id,
    mpn: product._id,
    ...(product.brand && { brand: { '@type': 'Brand', name: product.brand } }),
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'NPR',
      price: salePrice,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.rating > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(product.rating),
            reviewCount: Number(product.reviewCount) || 0,
          },
        }
      : {}),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${origin}/products` },
      ...(product.category
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.category.name,
              item: `${origin}/categories/${product.category.slug}`,
            },
            { '@type': 'ListItem', position: 4, name: product.name },
          ]
        : [{ '@type': 'ListItem', position: 3, name: product.name }]),
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Seo
        title={`${product.name} | 1Shop Nepal`}
        description={seoDescription}
        canonical={productUrl}
        type="product"
        image={images[0]}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-orange-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-orange-600">Products</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link
              to={`/categories/${product.category.slug}`}
              className="hover:text-orange-600"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="relative">
              {discount > 0 && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 text-sm font-semibold rounded-full bg-orange-600 text-white">
                  -{discount}%
                </span>
              )}
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-gray-300">
                  No image
                </div>
              )}
            </div>
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    activeImage === i ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-orange-600 font-medium">
            {product.category?.name || 'General'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            {product.name}
          </h1>
          {product.brand && (
            <p className="text-sm text-gray-500 mt-1">Brand: {product.brand}</p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(product.rating || 0)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {product.rating?.toFixed(1) || 'New'}
            </span>
            {product.reviewCount > 0 && (
              <a href="#reviews" className="text-sm text-gray-500 hover:text-orange-600">
                ({product.reviewCount} reviews)
              </a>
            )}
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              Rs. {salePrice.toLocaleString()}
            </span>
            {discount > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  Rs. {regularPrice.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  You save Rs. {(regularPrice - salePrice).toLocaleString()}
                </span>
              </>
            )}
          </div>

          <div className="mt-4">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${
                inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
              }`}
            >
              {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {product.description && (
            <p className="mt-5 text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                className="p-2.5 hover:bg-gray-50"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              } ${!inStock ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </>
              )}
            </button>

            <button
              onClick={() => setLiked((l) => !l)}
              aria-label="Add to wishlist"
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Heart
                className={`w-5 h-5 ${
                  liked ? 'fill-red-500 text-red-500' : 'text-gray-500'
                }`}
              />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Truck className="w-5 h-5 text-orange-600" /> Fast Delivery
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-orange-600" /> Secure Payment
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <RotateCcw className="w-5 h-5 text-orange-600" /> Easy Returns
            </div>
          </div>
        </div>
      </div>

      {specs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
          <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
            {specs.map(([key, value]) => (
              <div key={key} className="flex px-5 py-3">
                <span className="w-48 text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-sm text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ReviewsSection product={product} onProductUpdate={handleProductUpdate} />

      {recommended.length > 0 && (
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-xl font-bold text-gray-900">Recommended For You</h2>
            <p className="text-xs text-gray-400">
              Scored by category, price, rating &amp; popularity — no machine learning
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-4">
            {recommended.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {recommendedReasons.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {recommendedReasons.map((reason) => (
                <span
                  key={reason}
                  className="px-2.5 py-1 text-[11px] font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-full capitalize"
                >
                  {reason}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
